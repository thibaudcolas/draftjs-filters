import { convertFromRaw } from "draft-js"

import { whitespaceCharacters } from "./text"

describe("text", () => {
  describe("#whitespaceCharacters", () => {
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
      content = whitespaceCharacters(content, ["\n"])
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
        a: { text: "So ft", styles: [[], [], [], [], []] },
        b: { text: "So ft", styles: [["BOLD"], ["BOLD"], ["BOLD"], [], []] },
      })
    })
  })
})
