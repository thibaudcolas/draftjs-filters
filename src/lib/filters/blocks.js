// @flow
import { ContentState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { UNSTYLED, UNORDERED_LIST_ITEM, ORDERED_LIST_ITEM } from "../constants"

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
 * Resets the depth of all the content to at most max.
 */
export const limitBlockDepth = (max: number, content: ContentState) => {
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => block.getDepth() > max)
    .map((block) => block.set("depth", max))

  return changedBlocks.size === 0
    ? content
    : content.merge({
        blockMap: blockMap.merge(changedBlocks),
      })
}

/**
 * Removes all block types not present in the whitelist.
 */
export const filterBlockTypes = (
  whitelist: Array<DraftBlockType>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => !whitelist.includes(block.getType()))
    .map((block) => block.set("type", UNSTYLED))

  return changedBlocks.size === 0
    ? content
    : content.merge({
        blockMap: blockMap.merge(changedBlocks),
      })
}
