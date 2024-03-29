import { ContentState, ContentBlock } from "draft-js"
import { UNSTYLED, UNORDERED_LIST_ITEM, ORDERED_LIST_ITEM } from "../constants"

/**
 * Removes blocks that have a non-zero depth, and aren't list items.
 * Happens with Apple Pages inserting `unstyled` items between list items.
 */
export const removeInvalidDepthBlocks = (content: ContentState) => {
  const blockMap = content.getBlockMap()

  const isValidDepthBlock = (block?: ContentBlock) => {
    const isListBlock = [UNORDERED_LIST_ITEM, ORDERED_LIST_ITEM].includes(
      block!.getType(),
    )

    return isListBlock || block!.getDepth() === 0
  }

  const filteredBlocks = blockMap.filter(isValidDepthBlock)

  if (filteredBlocks.size !== blockMap.size) {
    return content.merge({
      blockMap: filteredBlocks,
    }) as ContentState
  }

  return content
}

/**
 * Rules used to automatically convert blocks from one type to another
 * based on the block’s text. Also supports setting the block depth.
 * Defaults to the filters’ built-in block prefix rules.
 */
export interface BlockTextRule {
  // A regex as a string, to match against block text, e.g. "^(◦|o |o\t)".
  test: string
  // The type to convert the block to if the test regex matches.
  type: string
  // The depth to set (e.g. for list items with different prefixes per depth).
  depth: number
}

/**
 * Changes block type and depth based on the block's text. – some word processors
 * add a specific prefix within the text, eg. "· Bulleted list" in Word 2010.
 * Also removes the matched text.
 * This is meant first and foremost for list items where the list bullet or numeral
 * ends up in the text. Other use cases may not be well covered.
 */
export const preserveBlockByText = (
  rules: readonly BlockTextRule[],
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const blocks = blockMap
    .filter((block) => block!.getType() === "unstyled")
    .map((block) => {
      const text = block!.getText()
      let newBlock = block as ContentBlock
      let match!: RegExpExecArray | null

      const matchingRule = rules.find((rule) => {
        match = new RegExp(rule.test).exec(text)
        return match !== null
      })

      if (matchingRule && match && match[0]) {
        const text = newBlock.getText()
        const entity = newBlock.getEntityAt(0)

        // Special case – do not convert the block if there is an entity at the start, and the matching text is the full block’s text.
        // This can happen in Word for equations, which are injected as images with text "📷 ".
        if (entity && match[0] === text) {
          return newBlock
        }

        // Unicode gotcha:
        // At the moment, Draft.js stores one CharacterMetadata in the character list
        // for each "character" in an astral symbol. "📷" has a length of 2, is stored with two CharacterMetadata instances.
        // What matters is that we remove the correct number of chars from both
        // the text and the List<CharacterMetadata>. So – we want to use the ES5 way of counting
        // a string length.
        // See https://mathiasbynens.be/notes/javascript-unicode.
        const sliceOffset = match[0].length

        // Maintain persistence in the list while removing chars from the start.
        // https://github.com/facebook/draft-js/blob/788595984da7c1e00d1071ea82b063ff87140be4/src/model/transaction/removeRangeFromContentState.js#L333
        let chars = newBlock.getCharacterList()
        let startOffset = 0
        while (startOffset < sliceOffset) {
          chars = chars.shift()
          startOffset++
        }

        newBlock = newBlock.merge({
          type: matchingRule.type,
          depth: matchingRule.depth,
          text: text.slice(sliceOffset),
          characterList: chars,
        }) as ContentBlock
      }

      return newBlock
    })

  return blocks.size === 0
    ? content
    : (content.merge({
        blockMap: blockMap.merge(blocks),
      }) as ContentState)
}

/**
 * Resets the depth of all the content to at most max.
 */
export const limitBlockDepth = (max: number, content: ContentState) => {
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => block!.getDepth() > max)
    .map((block) => block!.set("depth", max) as ContentBlock)

  return changedBlocks.size === 0
    ? content
    : (content.merge({
        blockMap: blockMap.merge(changedBlocks),
      }) as ContentState)
}

/**
 * Converts all block types not present in the list to unstyled.
 * Also sets depth to 0 (for potentially nested list items).
 */
export const filterBlockTypes = (
  allowlist: readonly string[],
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => !allowlist.includes(block!.getType()))
    .map(
      (block) =>
        block!.merge({
          type: UNSTYLED,
          depth: 0,
        }) as ContentBlock,
    )

  return changedBlocks.size === 0
    ? content
    : (content.merge({
        blockMap: blockMap.merge(changedBlocks),
      }) as ContentState)
}
