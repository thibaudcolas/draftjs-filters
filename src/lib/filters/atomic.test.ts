import { EditorState, convertFromRaw, RawDraftContentState } from "draft-js"

import {
  preserveAtomicBlocks,
  resetAtomicBlocks,
  removeInvalidAtomicBlocks,
} from "./atomic"

describe("atomic", () => {
  describe("#preserveAtomicBlocks", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {
          4: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "/example.png",
            },
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
          },
          {
            key: "b",
            text: "📷",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
          },
          {
            key: "c",
            text: " ",
            entityRanges: [],
          },
          {
            key: "d",
            text: "📷 Star list",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
          },
        ],
      } as unknown as RawDraftContentState)

      expect(
        preserveAtomicBlocks(content)
          .getBlockMap()
          .map((b) => b!.getType())
          .toJS(),
      ).toEqual({
        a: "atomic",
        b: "atomic",
        c: "unstyled",
        d: "unstyled",
      })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(preserveAtomicBlocks(content)).toBe(content)
    })
  })

  describe("#resetAtomicBlocks", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {
          4: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "/example.png",
            },
          },
        },
        blocks: [
          {
            key: "a",
            text: "📷",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
          },
          {
            key: "b",
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
            inlineStyleRanges: [
              {
                offset: 0,
                length: 1,
                style: "BOLD",
              },
            ],
          },
        ],
      } as unknown as RawDraftContentState)

      expect(
        resetAtomicBlocks(content)
          .getBlockMap()
          .map((b) => ({
            text: b!.getText(),
            type: b!.getType(),
            style: b!.getInlineStyleAt(0).size,
          }))
          .toJS(),
      ).toEqual({
        a: { text: " ", type: "atomic", style: 0 },
        b: { text: " ", type: "atomic", style: 0 },
      })
    })

    it("no filtering = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(resetAtomicBlocks(content)).toBe(content)
    })
  })

  describe("#removeInvalidAtomicBlocks", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {
          4: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "/example.png",
            },
          },
          5: {
            type: "EMBED",
            mutability: "IMMUTABLE",
            data: {
              url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
            },
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
            inlineStyleRanges: [],
          },
        ],
      } as unknown as RawDraftContentState)

      expect(
        removeInvalidAtomicBlocks([{ type: "IMAGE" }], content)
          .getBlockMap()
          .map((b) => ({
            text: b!.getText(),
            type: b!.getType(),
          }))
          .toJS(),
      ).toEqual({
        a: { text: " ", type: "atomic" },
      })
    })

    it("no filtering = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(removeInvalidAtomicBlocks([], content)).toBe(content)
    })
  })
})
