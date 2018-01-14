import { CharacterMetadata, ContentState } from "draft-js"

import { ATOMIC } from "../constants"

/**
 * Creates atomic blocks where they would be required for a block-level entity
 * to work correctly, when such an entity exists.
 * Note: at the moment, this is only useful for IMAGE entities that Draft.js
 * injects on arbitrary blocks on paste.
 */
export const preserveAtomicBlocks = (
  whitelist: Array<string>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const perservedBlocks = blockMap
    .filter((block) => {
      const entityKey = block.getEntityAt(0)
      // Use the ES6 way of counting string length to account for unicode symbols.
      // See https://mathiasbynens.be/notes/javascript-unicode.
      const isSingleSymbol = Array.from(block.getText()).length === 1

      return (
        entityKey &&
        isSingleSymbol &&
        whitelist.includes(content.getEntity(entityKey).getType())
      )
    })
    .map((block) => block.set("type", ATOMIC))

  if (perservedBlocks.size !== 0) {
    return content.merge({
      blockMap: blockMap.merge(perservedBlocks),
    })
  }

  return content
}

/**
 * Resets atomic blocks to have a single-space char and no styles.
 */
export const resetAtomicBlocks = (content: ContentState) => {
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

  return content.merge({
    blockMap: blocks,
  })
}

/**
 * Removes atomic blocks for which the entity isn't whitelisted.
 */
export const removeInvalidAtomicBlocks = (
  whitelist: Array<Object>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const isValidAtomicBlock = (block) => {
    if (block.getType() !== ATOMIC) {
      return true
    }

    const entityKey = block.getEntityAt(0)
    let isValid

    if (entityKey) {
      const type = content.getEntity(entityKey).getType()

      isValid = whitelist.some((t) => t.type === type)
    } else {
      isValid = false
    }

    return isValid
  }

  const filteredBlocks = blockMap.filter(isValidAtomicBlock)

  if (filteredBlocks.size !== blockMap.size) {
    return content.merge({
      blockMap: filteredBlocks,
    })
  }

  return content
}
