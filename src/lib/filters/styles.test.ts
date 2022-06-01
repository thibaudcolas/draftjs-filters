import { EditorState, convertFromRaw, RawDraftContentState } from "draft-js"

import { filterInlineStyles } from "./styles"

describe("styles", () => {
  describe("#filterInlineStyles", () => {
    it("works", () => {
      const content = convertFromRaw({
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
      } as unknown as RawDraftContentState)

      expect(
        filterInlineStyles(["BOLD"], content)
          .getBlockMap()
          .map((b) => b!.getCharacterList().map((c) => c!.getStyle()))
          .toJS(),
      ).toEqual({
        a: [["BOLD"], [], ["BOLD"]],
      })
    })

    it("no filtering = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(filterInlineStyles([], content)).toBe(content)
    })
  })
})
