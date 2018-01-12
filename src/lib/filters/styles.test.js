import { EditorState, convertFromRaw } from "draft-js"

import { filterInlineStyle } from "./styles"

describe("styles", () => {
  describe("#filterInlineStyle", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "d3071",
            text: "tes",
            type: "unstyled",
            depth: 0,
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
            entityRanges: [],
            data: {},
          },
          {
            key: "abbm4",
            text: "t",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 0,
                length: 1,
                style: "BOLD",
              },
            ],
            entityRanges: [],
            data: {},
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
      ).toEqual({ abbm4: [["BOLD"]], d3071: [["BOLD"], [], ["BOLD"]] })
    })
  })
})
