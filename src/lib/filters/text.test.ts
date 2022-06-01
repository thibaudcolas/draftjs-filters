import { EditorState, convertFromRaw } from "draft-js"

import { replaceTextBySpaces } from "./text"

describe("text", () => {
  describe("#replaceTextBySpaces", () => {
    it("works", () => {
      let content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "So\nft",
            type: "unstyled",
          },
          {
            key: "b",
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
      content = replaceTextBySpaces(["\n"], content)
      expect(
        content
          .getBlockMap()
          .map((b) => ({
            text: b.getText(),
            styles: b
              .getCharacterList()
              .map((c) => c.getStyle())
              .toJS(),
          }))
          .toJS(),
      ).toEqual({
        a: {
          text: "So ft",
          styles: [[], [], [], [], []],
        },
        b: {
          text: "So ft",
          styles: [["BOLD"], ["BOLD"], ["BOLD"], [], []],
        },
      })
    })
  })

  it("no filtering = no change", () => {
    const content = EditorState.createEmpty().getCurrentContent()
    expect(replaceTextBySpaces([], content)).toBe(content)
  })
})
