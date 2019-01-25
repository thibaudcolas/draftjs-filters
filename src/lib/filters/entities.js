// @flow
import { CharacterMetadata, ContentState } from "draft-js"
import { ATOMIC, IMAGE } from "../constants"

/**
 * Clones entities in the entityMap, so each range points to its own entity instance.
 * This only clones entities as necessary – if an entity is only referenced
 * in a single range, it won't be changed.
 */
export const cloneEntities = (content: ContentState) => {
  let newContent = content
  const blockMap = newContent.getBlockMap()

  const encounteredEntities = []

  // Marks ranges that need cloning, because their entity has been encountered previously.
  const shouldCloneEntity = (firstChar) => {
    const key = firstChar.getEntity()

    if (key) {
      if (encounteredEntities.includes(key)) {
        return true
      }

      encounteredEntities.push(key)
    }

    return false
  }

  // We're going to update blocks that contain ranges pointing at the same entity as other ranges.
  const blocks = blockMap.map((block) => {
    let newChars = block.getCharacterList()
    let altered = false

    // Updates ranges for which the entity needs to be cloned.
    const updateRangeWithClone = (start, end) => {
      const key = newChars.get(start).getEntity()
      const entity = newContent.getEntity(key)

      newContent = newContent.createEntity(
        entity.getType(),
        entity.getMutability(),
        entity.getData(),
      )
      const newKey = newContent.getLastCreatedEntityKey()

      // Update all of the chars in the range with the new entity.
      newChars = newChars.map((char, i) => {
        if (start <= i && i <= end) {
          return CharacterMetadata.applyEntity(char, newKey)
        }

        return char
      })

      altered = true
    }

    block.findEntityRanges(shouldCloneEntity, updateRangeWithClone)

    return altered ? block.set("characterList", newChars) : block
  })

  return newContent.merge({
    blockMap: blockMap.merge(blocks),
  })
}

/*:: import type { BlockNode } from "draft-js/lib/BlockNode.js.flow" */

/**
 * Filters entity ranges (where entities are applied on text) based on the result of
 * the callback function. Returning true keeps the entity range, false removes it.
 * Draft.js automatically removes entities if they are not applied on any text.
 */
export const filterEntityRanges = (
  filterFn: (
    content: ContentState,
    entityKey: string,
    block: BlockNode,
  ) => boolean,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  /*
   * Removes entities from the character list if the entity isn't enabled.
   * Also removes image entities placed outside of atomic blocks, which can happen
   * on paste.
   * A better approach would probably be to split the block where the image is and
   * create an atomic block there, but that's another story. This is what Draft.js
   * does when the copy-paste is all within one editor.
   */
  const blocks = blockMap.map((block) => {
    let altered = false

    const chars = block.getCharacterList().map((char) => {
      const entityKey = char.getEntity()

      if (entityKey) {
        const shouldRemove = !filterFn(content, entityKey, block)

        if (shouldRemove) {
          altered = true
          return CharacterMetadata.applyEntity(char, null)
        }
      }

      return char
    })

    return altered ? block.set("characterList", chars) : block
  })

  return content.merge({
    blockMap: blockMap.merge(blocks),
  })
}

/**
 * Keeps all entity types (images, links, documents, embeds) that are enabled.
 */
export const shouldKeepEntityType = (
  whitelist: $ReadOnlyArray<{ type: string }>,
  type: string,
) => {
  return whitelist.some((e) => e.type === type)
}

/**
 * Removes invalid images – they should only be in atomic blocks.
 * This only removes the image entity, not the camera emoji (📷) that Draft.js inserts.
 */
export const shouldRemoveImageEntity = (
  entityType: string,
  blockType: string,
) => {
  return entityType === IMAGE && blockType !== ATOMIC
}

/**
 * Filters entities based on the data they contain.
 */
export const shouldKeepEntityByAttribute = (
  entityTypes: $ReadOnlyArray<{
    type: string,
    whitelist: {
      [attribute: string]: string | boolean,
    },
  }>,
  entityType: string,
  data: {},
) => {
  const config = entityTypes.find((t) => t.type === entityType)
  // If no whitelist is defined, the filter keeps the entity.
  const whitelist = config && config.whitelist ? config.whitelist : {}

  const isValid = Object.keys(whitelist).every((attr) => {
    const check = whitelist[attr]

    if (typeof check === "boolean") {
      const hasData = data.hasOwnProperty(attr)

      return check ? hasData : !hasData
    }

    return new RegExp(check).test(data[attr])
  })

  return isValid
}

/**
 * Filters data on an entity to only retain what is whitelisted.
 * This is crucial for IMAGE and LINK, where Draft.js adds a lot
 * of unneeded attributes (width, height, etc).
 */
export const filterEntityData = (
  entityTypes: $ReadOnlyArray<{
    type: string,
    attributes: $ReadOnlyArray<string>,
  }>,
  content: ContentState,
) => {
  let newContent = content
  const entities = {}

  newContent.getBlockMap().forEach((block) => {
    block.findEntityRanges((char) => {
      const entityKey = char.getEntity()
      if (entityKey) {
        const entity = newContent.getEntity(entityKey)
        entities[entityKey] = entity
      }
    })
  })

  Object.keys(entities).forEach((key) => {
    const entity = entities[key]
    const data = entity.getData()
    const config = entityTypes.find((t) => t.type === entity.getType())
    const whitelist = config ? config.attributes : null

    // If no whitelist is defined, keep all of the data.
    if (!whitelist) {
      return data
    }

    const newData = whitelist.reduce((attrs, attr) => {
      // We do not want to include undefined values if there is no data.
      if (data.hasOwnProperty(attr)) {
        attrs[attr] = data[attr]
      }

      return attrs
    }, {})

    newContent = newContent.replaceEntityData(key, newData)
  })

  return newContent
}
