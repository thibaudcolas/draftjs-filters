// @flow
import { EditorState, CharacterMetadata } from "draft-js"

/**
 * Removes all styles that use unavailable types.
 */
export const filterInlineStyle = (
  editorState: EditorState,
  enabledTypes: Array<string>,
) => {
  const content = editorState.getCurrentContent()
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

  return EditorState.set(editorState, {
    currentContent: content.merge({
      blockMap: blockMap.merge(blocks),
    }),
  })
}
