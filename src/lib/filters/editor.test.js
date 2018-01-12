import { EditorState } from "draft-js"

import { IMAGE, HORIZONTAL_RULE } from "../constants"
import { filterEditorState } from "./editor"

describe("editor", () => {
  describe("#filterEditorState", () => {
    it("works", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState(
          editorState,
          1,
          false,
          false,
          ["header-five"],
          ["bold"],
          [IMAGE],
        ),
      ).toBeInstanceOf(EditorState)
    })

    it("enableHorizontalRule", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState(editorState, 1, true, false, [], [], []),
      ).toBeInstanceOf(EditorState)
    })

    it("enableLineBreak", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState(editorState, 1, false, true, [], [], []),
      ).toBeInstanceOf(EditorState)
    })
  })
})
