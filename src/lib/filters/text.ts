import { ContentBlock, ContentState } from "draft-js"

/**
 * Replaces the given characters by their equivalent length of spaces, in all blocks.
 */
export const replaceTextBySpaces = (
  characters: readonly string[],
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()
  const blocks = blockMap.map((block) => {
    const text = block!.getText()

    // Only replaces the character(s) with as many spaces as their length,
    // so that style and entity ranges are left undisturbed.
    // If we want to completely remove the character, we also need to filter
    // the corresponding CharacterMetadata entities.
    const newText = characters.reduce((txt, char) => {
      return txt.replace(new RegExp(char, "g"), " ".repeat(char.length))
    }, text)

    return (
      text !== newText ? block!.set("text", newText) : block
    ) as ContentBlock
  })

  return content.merge({
    blockMap: blockMap.merge(blocks),
  }) as ContentState
}
