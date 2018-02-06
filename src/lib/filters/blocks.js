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
 * Changes block type and depth based on the block's text. – some word processors
 * add a specific prefix within the text, eg. "· Bulleted list" in Word 2010.
 * Also removes the matched prefix.
 */
export const preserveBlockByText = (
  rules: Array<{
    test: string,
    type: DraftBlockType,
    depth: number,
  }>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const blocks = blockMap
    .filter((block) => block.getType() === "unstyled")
    .map((block) => {
      const text = block.getText()
      let newBlock = block
      let match
      const matchingRule = rules.find((rule) => {
        match = new RegExp(rule.test).exec(text)
        return match !== null
      })

      if (matchingRule && match && match[0]) {
        // Unicode gotcha:
        // At the moment, Draft.js stores one CharacterMetadata in the character list
        // for each "character" in an astral symbol. "📷" has a length of 2.
        // What matters is that we remove the correct number of chars from both
        // the text and the List<CharacterMetadata>. So – we want to use the ES5 way of counting
        // a string length.
        // See https://mathiasbynens.be/notes/javascript-unicode.
        const sliceOffset = match[0].length

        // Maintain persistence in the list while removing chars from the start.
        // https://github.com/facebook/draft-js/blob/788595984da7c1e00d1071ea82b063ff87140be4/src/model/transaction/removeRangeFromContentState.js#L333
        let chars = block.getCharacterList()
        let startOffset = 0
        while (startOffset < sliceOffset) {
          chars = chars.shift()
          startOffset++
        }

        newBlock = newBlock.merge({
          type: matchingRule.type,
          depth: matchingRule.depth,
          text: block.getText().slice(sliceOffset),
          characterList: chars,
        })
      }

      return newBlock
    })

  return blocks.size === 0
    ? content
    : content.merge({
        blockMap: blockMap.merge(blocks),
      })
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
