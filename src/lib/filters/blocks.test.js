import {
  EditorState,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js"

import { UNSTYLED, IMAGE } from "../constants"
import { preserveAtomicBlocks, resetBlockDepth, resetBlockType } from "./blocks"

describe("blocks", () => {
  describe("#preserveAtomicBlocks", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "4": {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "../static/example-lowres-image.jpg",
            },
          },
          "5": {
            type: "EMBED",
            mutability: "IMMUTABLE",
            data: {
              url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
            },
          },
        },
        blocks: [
          {
            key: "d3071",
            text: " ",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
            data: {},
          },
          {
            key: "affm4",
            text: " ",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 5,
              },
            ],
            data: {},
          },
          {
            key: "abbm4",
            text: " ",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
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
        d3071: "atomic",
        affm4: "unstyled",
        abbm4: "unstyled",
      })
    })

    it("no normalisation = no change", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "4": {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "../static/example-lowres-image.jpg",
            },
          },
        },
        blocks: [
          {
            key: "d3071",
            text: " ",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 4,
              },
            ],
            data: {},
          },
        ],
      })

      const editorState = EditorState.createWithContent(contentState)

      expect(preserveAtomicBlocks(editorState, [])).toBe(editorState)
    })
  })

  describe("#resetBlockDepth", () => {
    it("normalises depth to a given number", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "d3071",
            text: "Depth 0",
            type: "unordered-list-item",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: "affm4",
            text: "Depth 1",
            type: "unordered-list-item",
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: "abbm4",
            text: "Depth 2",
            type: "unordered-list-item",
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
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
      ).toEqual({ abbm4: 1, affm4: 1, d3071: 0 })
    })

    it("no normalisation = no change", () => {
      const editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(`<ul><li>Depth 0</li></ul>`),
        ),
      )
      expect(resetBlockDepth(editorState, 1)).toBe(editorState)
    })
  })

  describe("#resetBlockType", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "d3071",
            text: "P",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: "affm4",
            text: "UL",
            type: "unordered-list-item",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: "abbm1",
            text: "H1",
            type: "header-one",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: "abbm4",
            text: "H2",
            type: "header-two",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: "abbm8",
            text: "H3",
            type: "header-three",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      })
      const editorState = resetBlockType(
        EditorState.createWithContent(contentState),
        ["unordered-list-item", "header-two"],
      )
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((block) => block.getType())
          .toJS(),
      ).toEqual({
        abbm1: "unstyled",
        abbm4: "header-two",
        abbm8: "unstyled",
        affm4: "unordered-list-item",
        d3071: "unstyled",
      })
    })

    it("no normalisation = no change", () => {
      const editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(`<ul><li>UL</li></ul><p>P</p><h2>H2</h2>`),
        ),
      )
      expect(
        resetBlockType(editorState, [
          UNSTYLED,
          "unordered-list-item",
          "header-two",
        ]),
      ).toBe(editorState)
    })
  })
})
