import { ContentState, CharacterMetadata } from "draft-js"

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

    const chars = block.getCharacterList().map((char) => {
      let newChar = char

      char
        .getStyle()
        .filter((type) => !allowlist.includes(type))
        .forEach((type) => {
          altered = true
          newChar = CharacterMetadata.removeStyle(newChar, type)
        })

      return newChar
    })

    return altered ? block.set("characterList", chars) : block
  })

  return content.merge({
    blockMap: blockMap.merge(blocks),
  })
}
