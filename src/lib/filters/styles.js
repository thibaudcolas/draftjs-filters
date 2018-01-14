// @flow
import { ContentState, CharacterMetadata } from "draft-js"

/**
 * Removes all styles that use unavailable types.
 */
export const filterInlineStyle = (
  enabledTypes: Array<string>,
  content: ContentState,
) => {
  const blockMap = content.getBlockMap()

  const blocks = blockMap.map((block) => {
    let altered = false

    const chars = block.getCharacterList().map((char) => {
      let newChar = char

      char
        .getStyle()
        .filter((type) => !enabledTypes.includes(type))
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
