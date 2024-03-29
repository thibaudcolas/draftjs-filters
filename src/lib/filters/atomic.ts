import { CharacterMetadata, ContentBlock, ContentState } from "draft-js"
import { ATOMIC } from "../constants"
import { EntityRule } from "./entities"

/**
 * Creates atomic blocks where they would be required for a block-level entity
 * to work correctly, when such an entity exists.
 * Note: at the moment, this is only useful for IMAGE entities that Draft.js
 * injects on arbitrary blocks on paste.
 */
export const preserveAtomicBlocks = (content: ContentState) => {
  const blockMap = content.getBlockMap()

  const preservedBlocks = blockMap
    .filter((block) => {
      const text = block!.getText()
      const entityKey = block!.getEntityAt(0)
      const shouldPreserve =
        Boolean(entityKey) && ["📷", " ", "📷 "].includes(text)

      return shouldPreserve
    })
    .map((block) => block!.set("type", ATOMIC) as ContentBlock)

  if (preservedBlocks.size !== 0) {
    return content.merge({
      blockMap: blockMap.merge(preservedBlocks),
    }) as ContentState
  }

  return content
}

/**
 * Resets atomic blocks to have a single-space char and no styles.
 * This is how they are stored by Draft.js by default.
 */
export const resetAtomicBlocks = (content: ContentState) => {
  const blockMap = content.getBlockMap()
  let blocks = blockMap

  const normalisedBlocks = blocks
    .filter(
      (block) =>
        block!.getType() === ATOMIC &&
        (block!.getText() !== " " || block!.getInlineStyleAt(0).size !== 0),
    )
    .map((block) => {
      // Retain only the first character, and remove all of its styles.
      const chars = block!
        .getCharacterList()
        .slice(0, 1)
        .map((char) => {
          let newChar = char as CharacterMetadata

          char!.getStyle().forEach((type) => {
            newChar = CharacterMetadata.removeStyle(newChar, type as string)
          })

          return newChar
        })

      return block!.merge({
        text: " ",
        characterList: chars,
      }) as ContentBlock
    })

  if (normalisedBlocks.size !== 0) {
    blocks = blocks.merge(normalisedBlocks)
  }

  return content.merge({
    blockMap: blocks,
  }) as ContentState
}

/**
 * Removes atomic blocks for which the entity type isn't allowed.
 */
export const removeInvalidAtomicBlocks = (
  allowlist: readonly EntityRule[],
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const isValidAtomicBlock = (block?: ContentBlock) => {
    if (block!.getType() !== ATOMIC) {
      return true
    }

    const entityKey = block!.getEntityAt(0)
    let isValid

    if (entityKey) {
      const type = content.getEntity(entityKey).getType()

      isValid = allowlist.some((t) => t.type === type)
    } else {
      isValid = false
    }

    return isValid
  }

  const filteredBlocks = blockMap.filter(isValidAtomicBlock)

  if (filteredBlocks.size !== blockMap.size) {
    return content.merge({
      blockMap: filteredBlocks,
    }) as ContentState
  }

  return content
}
