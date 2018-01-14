// @flow
import { CharacterMetadata, ContentState, ContentBlock } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { ATOMIC, UNSTYLED, IMAGE } from "../constants"

/**
 * Resets atomic blocks to unstyled based on which entity types are enabled,
 * and also normalises block text to a single "space" character.
 */
export const resetAtomicBlocks = (
  enabledTypes: Array<string>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()
  let blocks = blockMap

  const normalisedBlocks = blocks
    .filter(
      (block) =>
        block.getType() === ATOMIC &&
        (block.getText() !== " " || block.getInlineStyleAt(0).size !== 0),
    )
    .map((block) => {
      // Retain only the first character, and remove all of its styles.
      const chars = block
        .getCharacterList()
        .slice(0, 1)
        .map((char) => {
          let newChar = char

          char.getStyle().forEach((type) => {
            newChar = CharacterMetadata.removeStyle(newChar, type)
          })

          return newChar
        })

      return block.merge({
        text: " ",
        characterList: chars,
      })
    })

  if (normalisedBlocks.size !== 0) {
    blocks = blocks.merge(normalisedBlocks)
  }

  const resetBlocks = blocks
    .filter((block) => block.getType() === ATOMIC)
    .filter((block) => {
      const entityKey = block.getEntityAt(0)
      let shouldReset = false

      if (entityKey) {
        const entityType = content.getEntity(entityKey).getType()

        shouldReset = !enabledTypes.includes(entityType)
      }

      return shouldReset
    })
    .map((block) => block.set("type", UNSTYLED))

  if (resetBlocks.size !== 0) {
    blocks = blocks.merge(resetBlocks)
  }

  return content.merge({
    blockMap: blockMap.merge(blocks),
  })
}

/**
 *
 */
export const filterEntityRanges = (
  filterFn: (
    content: ContentState,
    entityKey: string,
    block: ContentBlock,
  ) => boolean,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  /**
   * Removes entities from the character list if the character entity isn't enabled.
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
  enabledTypes: Array<string>,
  entityType: string,
) => {
  return enabledTypes.includes(entityType)
}

/**
 * Removes invalid images – they should only be in atomic blocks.
 * This only removes the image entity, not the camera emoji (📷) that Draft.js inserts.
 * If we want to remove this in the future, consider that:
 * - It needs to be removed in the block text, where it's 2 chars / 1 code point.
 * - The corresponding CharacterMetadata needs to be removed too, and it's 2 instances
 */
export const shouldRemoveImageEntity = (
  entityType: string,
  blockType: DraftBlockType,
) => {
  return entityType === IMAGE && blockType !== ATOMIC
}

export const shouldKeepEntityByAttribute = (
  entityTypes: Array<Object>,
  entityType: string,
  data: Object,
) => {
  // $FlowFixMe
  const whitelist = entityTypes.find((t) => t.type === entityType).whitelist
  const isValid = Object.keys(whitelist).every((attr) => {
    const regex = new RegExp(whitelist[attr])
    return regex.test(data[attr])
  })

  return isValid
}

/**
 * Filters attributes on an entity to only retain the ones whitelisted.
 */
export const filterEntityAttributes = (
  entityTypes: Array<Object>,
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
    // $FlowFixMe
    const whitelist = entityTypes.find((t) => t.type === entity.getType())
      .attributes

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
