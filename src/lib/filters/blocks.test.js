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
  resetBlockDepth,
  resetBlockType,
} from "./blocks"

describe("blocks", () => {
  describe("#preserveAtomicBlocks", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "4": {
            type: "IMAGE",
            data: {
              src: "../static/example-lowres-image.jpg",
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
        preserveAtomicBlocks(EditorState.createWithContent(contentState), [
          IMAGE,
        ])
          .getCurrentContent()
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
      const editorState = EditorState.createEmpty()
      expect(preserveAtomicBlocks(editorState, [])).toBe(editorState)
    })
  })

  describe("#removeInvalidDepthBlocks", () => {
    it("normalises depth to a given number", () => {
      const contentState = convertFromRaw({
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
      const editorState = removeInvalidDepthBlocks(
        EditorState.createWithContent(contentState),
      )
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((block) => block.getDepth())
          .toJS(),
      ).toEqual({ a: 0, c: 2 })
    })

    it("no normalisation = no change", () => {
      const editorState = EditorState.createEmpty()
      expect(removeInvalidDepthBlocks(editorState)).toBe(editorState)
    })
  })

  describe("#resetBlockDepth", () => {
    it("normalises depth to a given number", () => {
      const contentState = convertFromRaw({
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
      const editorState = resetBlockDepth(
        EditorState.createWithContent(contentState),
        1,
      )
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((block) => block.getDepth())
          .toJS(),
      ).toEqual({ a: 0, b: 1, c: 1 })
    })

    it("no normalisation = no change", () => {
      const editorState = EditorState.createEmpty()
      expect(resetBlockDepth(editorState, 1)).toBe(editorState)
    })
  })

  describe("#resetBlockType", () => {
    it("works", () => {
      const contentState = convertFromRaw({
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
      const editorState = resetBlockType(
        EditorState.createWithContent(contentState),
        ["unordered-list-item"],
      )
      expect(
        editorState
          .getCurrentContent()
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
      const editorState = EditorState.createEmpty()
      expect(resetBlockType(editorState, [UNSTYLED])).toBe(editorState)
    })
  })
})
