// @flow
import { ContentState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import {
  ATOMIC,
  UNSTYLED,
  UNORDERED_LIST_ITEM,
  ORDERED_LIST_ITEM,
} from "../constants"

/**
 * Creates atomic blocks where they would be required for a block-level entity
 * to work correctly, when such an entity exists.
 * Note: at the moment, this is only useful for IMAGE entities that Draft.js
 * injects on arbitrary blocks on paste.
 */
export const preserveAtomicBlocks = (
  entityTypes: Array<string>,
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
        entityTypes.includes(content.getEntity(entityKey).getType())
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
 * Removes blocks that have a non-zero depth, and aren't list items.
 * Happens with Apple Pages inserting `unstyled` items between list items.
 */
export const removeInvalidDepthBlocks = (content: ContentState) => {
  const blockMap = content.getBlockMap()

  const isValidDepthBlock = (block) => {
    const isListBlock = [UNORDERED_LIST_ITEM, ORDERED_LIST_ITEM].includes(
      block.getType(),
    )

    return isListBlock || block.getDepth() === 0
  }

  const filteredBlocks = blockMap.filter(isValidDepthBlock)

  if (filteredBlocks.size !== blockMap.size) {
    return content.merge({
      blockMap: filteredBlocks,
    })
  }

  return content
}

/**
 * Resets the depth of all the content to at most maxNesting.
 */
export const resetBlockDepth = (maxNesting: number, content: ContentState) => {
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => block.getDepth() > maxNesting)
    .map((block) => block.set("depth", maxNesting))

  return changedBlocks.size === 0
    ? content
    : content.merge({
        blockMap: blockMap.merge(changedBlocks),
      })
}

/**
 * Resets all blocks that use unavailable types to unstyled.
 */
export const resetBlockType = (
  enabledTypes: Array<DraftBlockType>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => !enabledTypes.includes(block.getType()))
    .map((block) => block.set("type", UNSTYLED))

  return changedBlocks.size === 0
    ? content
    : content.merge({
        blockMap: blockMap.merge(changedBlocks),
      })
}
