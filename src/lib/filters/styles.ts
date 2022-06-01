import { ContentState, CharacterMetadata, ContentBlock } from "draft-js"

/**
 * Removes all styles not present in the list.
 */
export const filterInlineStyles = (
  allowlist: ReadonlyArray<string>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const blocks = blockMap.map((block) => {
    let altered = false

    const chars = block!.getCharacterList().map((char) => {
      let newChar = char as CharacterMetadata

      char!
        .getStyle()
        .filter((type) => !allowlist.includes(type as string))
        .forEach((type) => {
          altered = true
          newChar = CharacterMetadata.removeStyle(newChar, type as string)
        })

      return newChar
    })

    return (
      altered ? block!.set("characterList", chars) : block
    ) as ContentBlock
  })

  return content.merge({
    blockMap: blockMap.merge(blocks),
  }) as ContentState
}
