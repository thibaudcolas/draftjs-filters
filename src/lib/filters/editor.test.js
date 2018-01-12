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
          ["header-five"],
          ["bold"],
          [IMAGE],
        ),
      ).toBeInstanceOf(EditorState)
    })

    it(HORIZONTAL_RULE, () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState(editorState, 1, true, [], [], []),
      ).toBeInstanceOf(EditorState)
    })
  })
})
