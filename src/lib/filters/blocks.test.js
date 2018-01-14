import {
  EditorState,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js"

import { UNSTYLED, IMAGE } from "../constants"
import {
  preserveAtomicBlocks,
  removeInvalidDepthBlocks,
  limitBlockDepth,
  filterBlockTypes,
} from "./blocks"

describe("blocks", () => {
  describe("#preserveAtomicBlocks", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {
          "4": {
            type: "IMAGE",
            data: {
              src: "/example.png",
            },
          },
          "5": {
            type: "EMBED",
            data: {
              url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
            },
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
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
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 5,
              },
            ],
          },
          {
            key: "d",
            text: " ",
            entityRanges: [],
          },
          {
            key: "e",
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
      })

      expect(
        preserveAtomicBlocks([IMAGE], content)
          .getBlockMap()
          .map((b) => b.getType())
          .toJS(),
      ).toEqual({
        a: "atomic",
        b: "atomic",
        c: "unstyled",
        d: "unstyled",
        e: "unstyled",
      })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(preserveAtomicBlocks([], content)).toBe(content)
    })
  })

  describe("#removeInvalidDepthBlocks", () => {
    it("normalises depth to a given number", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "0",
            type: "ordered-list-item",
            depth: 0,
          },
          {
            key: "b",
            text: "1",
            type: "unstyled",
            depth: 1,
          },
          {
            key: "c",
            text: "2",
            type: "unordered-list-item",
            depth: 2,
          },
        ],
      })

      expect(
        removeInvalidDepthBlocks(content)
          .getBlockMap()
          .map((block) => block.getDepth())
          .toJS(),
      ).toEqual({ a: 0, c: 2 })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(removeInvalidDepthBlocks(content)).toBe(content)
    })
  })

  describe("#limitBlockDepth", () => {
    it("normalises depth to a given number", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "0",
            type: "unordered-list-item",
            depth: 0,
          },
          {
            key: "b",
            text: "1",
            type: "unordered-list-item",
            depth: 1,
          },
          {
            key: "c",
            text: "2",
            type: "unordered-list-item",
            depth: 2,
          },
        ],
      })
      expect(
        limitBlockDepth(1, content)
          .getBlockMap()
          .map((block) => block.getDepth())
          .toJS(),
      ).toEqual({ a: 0, b: 1, c: 1 })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(limitBlockDepth(1, content)).toBe(content)
    })
  })

  describe("#filterBlockTypes", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "P",
          },
          {
            key: "b",
            text: "UL",
            type: "unordered-list-item",
          },
          {
            key: "c",
            text: "H1",
            type: "header-one",
          },
        ],
      })

      expect(
        filterBlockTypes(["unordered-list-item"], content)
          .getBlockMap()
          .map((block) => block.getType())
          .toJS(),
      ).toEqual({
        a: "unstyled",
        b: "unordered-list-item",
        c: "unstyled",
      })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(filterBlockTypes([UNSTYLED], content)).toBe(content)
    })
  })
})
