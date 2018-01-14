import { EditorState, convertFromRaw } from "draft-js"

import { filterInlineStyle } from "./styles"

describe("styles", () => {
  describe("#filterInlineStyle", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "tes",
            inlineStyleRanges: [
              {
                offset: 0,
                length: 1,
                style: "BOLD",
              },
              {
                offset: 1,
                length: 1,
                style: "ITALIC",
              },
              {
                offset: 2,
                length: 1,
                style: "BOLD",
              },
              {
                offset: 2,
                length: 1,
                style: "ITALIC",
              },
            ],
          },
        ],
      })
      const editorState = filterInlineStyle(
        EditorState.createWithContent(contentState),
        ["BOLD"],
      )
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b.getCharacterList().map((c) => c.getStyle()))
          .toJS(),
      ).toEqual({ a: [["BOLD"], [], ["BOLD"]] })
    })
  })
})
