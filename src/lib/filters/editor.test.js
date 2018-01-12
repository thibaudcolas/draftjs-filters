import { EditorState } from "draft-js"

import { IMAGE } from "../constants"
import { filterEditorState } from "./editor"

describe("editor", () => {
  describe("#filterEditorState", () => {
    it("works", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState({
          editorState,
          maxListNesting: 1,
          enableHorizontalRule: false,
          enableLineBreak: false,
          blockTypes: ["header-five"],
          inlineStyles: ["bold"],
          entityTypes: [IMAGE],
        }),
      ).toBeInstanceOf(EditorState)
    })

    it("enableHorizontalRule", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState({
          editorState,
          maxListNesting: 1,
          enableHorizontalRule: true,
          enableLineBreak: false,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        }),
      ).toBeInstanceOf(EditorState)
    })

    it("enableLineBreak", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState({
          editorState,
          maxListNesting: 1,
          enableHorizontalRule: false,
          enableLineBreak: true,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        }),
      ).toBeInstanceOf(EditorState)
    })
  })
})
