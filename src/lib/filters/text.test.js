import { EditorState, convertFromRaw } from "draft-js"

import { whitespaceCharacters } from "./text"

describe("text", () => {
  describe("#whitespaceCharacters", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "4qkb1",
            text: "Soft\nLine break",
            type: "unstyled",
          },
        ],
      })
      const editorState = whitespaceCharacters(
        EditorState.createWithContent(contentState),
        ["\n"],
      )
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b.getText())
          .toJS(),
      ).toEqual({ "4qkb1": "Soft Line break" })
    })

    it("works with styles", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "4qkb1",
            text: "So\nft",
            type: "unstyled",
            inlineStyleRanges: [
              {
                offset: 0,
                length: 3,
                style: "BOLD",
              },
            ],
          },
        ],
      })
      const editorState = whitespaceCharacters(
        EditorState.createWithContent(contentState),
        ["\n"],
      )
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b.getText())
          .toJS(),
      ).toEqual({ "4qkb1": "So ft" })
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b.getCharacterList().map((c) => c.getStyle()))
          .toJS(),
      ).toEqual({ "4qkb1": [["BOLD"], ["BOLD"], ["BOLD"], [], []] })
    })
  })
})
