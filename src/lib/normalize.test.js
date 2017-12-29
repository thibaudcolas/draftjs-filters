import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertFromRaw,
} from "draft-js"

import normalize from "./normalize"

const UNSTYLED = "unstyled"
const ATOMIC = "atomic"
const IMAGE = "IMAGE"
const HORIZONTAL_RULE = "HORIZONTAL_RULE"

const BOLD = "BOLD"

const UNORDERED_LIST_ITEM = "unordered-list-item"
const HEADER_TWO = "header-two"
const HEADER_FIVE = "header-five"

describe("normalize", () => {
  describe("#filterEditorState", () => {
    beforeEach(() => {
      jest.spyOn(normalize, "preserveAtomicBlocks")
      jest.spyOn(normalize, "resetBlockDepth")
      jest.spyOn(normalize, "resetBlockType")
      jest.spyOn(normalize, "filterInlineStyle")
      jest.spyOn(normalize, "resetAtomicBlocks")
      jest.spyOn(normalize, "filterEntityType")
    })

    afterEach(() => {
      normalize.preserveAtomicBlocks.mockRestore()
      normalize.resetBlockDepth.mockRestore()
      normalize.resetBlockType.mockRestore()
      normalize.filterInlineStyle.mockRestore()
      normalize.resetAtomicBlocks.mockRestore()
      normalize.filterEntityType.mockRestore()
    })

    it("works", () => {
      const editorState = EditorState.createEmpty()
      expect(
        normalize.filterEditorState(
          editorState,
          1,
          false,
          [HEADER_FIVE],
          [BOLD],
          [IMAGE],
        ),
      ).toBeInstanceOf(EditorState)
      expect(normalize.preserveAtomicBlocks).toHaveBeenCalled()
      expect(normalize.resetBlockDepth).toHaveBeenCalled()
      expect(normalize.resetBlockType).toHaveBeenCalled()
      expect(normalize.filterInlineStyle).toHaveBeenCalled()
      expect(normalize.resetAtomicBlocks).toHaveBeenCalled()
      expect(normalize.filterEntityType).toHaveBeenCalled()
    })

    it(HORIZONTAL_RULE, () => {
      const editorState = EditorState.createEmpty()
      expect(
        normalize.filterEditorState(editorState, 1, true, [], [], []),
      ).toBeInstanceOf(EditorState)
      expect(normalize.preserveAtomicBlocks).toHaveBeenCalled()
      expect(normalize.resetBlockDepth).toHaveBeenCalled()
      expect(normalize.resetBlockType).toHaveBeenCalled()
      expect(normalize.filterInlineStyle).toHaveBeenCalled()
      expect(normalize.resetAtomicBlocks).toHaveBeenCalled()
      expect(normalize.filterEntityType).toHaveBeenCalledWith(
        expect.any(EditorState),
        [HORIZONTAL_RULE],
      )
    })
  })

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
        normalize
          .preserveAtomicBlocks(EditorState.createWithContent(contentState), [
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

      expect(normalize.preserveAtomicBlocks(editorState, [])).toBe(editorState)
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
      const editorState = normalize.resetBlockDepth(
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
      expect(normalize.resetBlockDepth(editorState, 1)).toBe(editorState)
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
      const editorState = normalize.resetBlockType(
        EditorState.createWithContent(contentState),
        [UNORDERED_LIST_ITEM, HEADER_TWO],
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
        normalize.resetBlockType(editorState, [
          UNSTYLED,
          UNORDERED_LIST_ITEM,
          HEADER_TWO,
        ]),
      ).toBe(editorState)
    })
  })

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
      const editorState = normalize.filterInlineStyle(
        EditorState.createWithContent(contentState),
        [BOLD],
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

  describe("#resetAtomicBlocks", () => {
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
            type: "atomic",
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
            type: "atomic",
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
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      })

      expect(
        normalize
          .resetAtomicBlocks(EditorState.createWithContent(contentState), [
            "EMBED",
          ])
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b.getType())
          .toJS(),
      ).toEqual({
        d3071: "unstyled",
        affm4: "atomic",
        abbm4: "atomic",
      })
    })

    it("normalises block text", () => {
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
            key: "3d071",
            text: "📷",
            type: "atomic",
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

      expect(
        normalize
          .resetAtomicBlocks(EditorState.createWithContent(contentState), [
            IMAGE,
          ])
          .getCurrentContent()
          .getFirstBlock()
          .toJS(),
      ).toMatchObject({
        text: " ",
      })
    })

    it("normalises block styles", () => {
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
            key: "3d071",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 0,
                length: 1,
                style: "BOLD",
              },
              {
                offset: 0,
                length: 1,
                style: "ITALIC",
              },
            ],
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

      expect(
        normalize
          .resetAtomicBlocks(EditorState.createWithContent(contentState), [
            IMAGE,
          ])
          .getCurrentContent()
          .getFirstBlock()
          .getInlineStyleAt(0).size,
      ).toBe(0)
    })

    describe(HORIZONTAL_RULE, () => {
      it("disabled", () => {
        const contentState = convertFromRaw({
          entityMap: {
            "3": {
              type: "HORIZONTAL_RULE",
              mutability: "IMMUTABLE",
              data: {},
            },
          },
          blocks: [
            {
              key: "epoas",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 3,
                },
              ],
              data: {},
            },
          ],
        })

        expect(
          normalize
            .resetAtomicBlocks(EditorState.createWithContent(contentState), [])
            .getCurrentContent()
            .getFirstBlock()
            .getType(),
        ).toBe("unstyled")
      })

      it("enabled", () => {
        const contentState = convertFromRaw({
          entityMap: {
            "3": {
              type: "HORIZONTAL_RULE",
              mutability: "IMMUTABLE",
              data: {},
            },
          },
          blocks: [
            {
              key: "epoas",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 3,
                },
              ],
              data: {},
            },
          ],
        })

        expect(
          normalize
            .resetAtomicBlocks(EditorState.createWithContent(contentState), [
              HORIZONTAL_RULE,
            ])
            .getCurrentContent()
            .getFirstBlock()
            .getType(),
        ).toBe("atomic")
      })
    })
  })

  describe("#filterEntityType", () => {
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
            key: "3d071",
            text: " ",
            type: "atomic",
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
            type: "atomic",
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
        ],
      })

      expect(
        normalize
          .filterEntityType(EditorState.createWithContent(contentState), [
            "EMBED",
          ])
          .getCurrentContent()
          .getBlockMap()
          .map((b) => {
            const entityKey = b.getEntityAt(0)
            return entityKey
              ? contentState.getEntity(entityKey).getType()
              : entityKey
          })
          .toJS(),
      ).toEqual({
        "3d071": null,
        affm4: "EMBED",
      })
    })

    it("works inline", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "0": {
            type: "LINK",
            mutability: "MUTABLE",
            data: {
              url: "www.example.com",
            },
          },
          "1": {
            type: "TEST",
            mutability: "MUTABLE",
            data: {
              url: "doc.pdf",
            },
          },
        },
        blocks: [
          {
            key: "6i47q",
            text: "NA link doc",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
              {
                offset: 3,
                length: 4,
                key: 0,
              },
              {
                offset: 8,
                length: 3,
                key: 1,
              },
            ],
            data: {},
          },
        ],
      })

      expect(
        normalize
          .filterEntityType(EditorState.createWithContent(contentState), [
            "LINK",
          ])
          .getCurrentContent()
          .getFirstBlock()
          .getCharacterList()
          .map((c) => c.getEntity())
          .map((e) => {
            return e ? contentState.getEntity(e).getType() : null
          })
          .toJS(),
      ).toEqual([
        null,
        null,
        null,
        "LINK",
        "LINK",
        "LINK",
        "LINK",
        null,
        null,
        null,
        null,
      ])
    })

    describe(HORIZONTAL_RULE, () => {
      it("disabled", () => {
        const contentState = convertFromRaw({
          entityMap: {
            "3": {
              type: "HORIZONTAL_RULE",
              mutability: "IMMUTABLE",
              data: {},
            },
          },
          blocks: [
            {
              key: "epoas",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 3,
                },
              ],
              data: {},
            },
          ],
        })

        expect(
          normalize
            .filterEntityType(EditorState.createWithContent(contentState), [])
            .getCurrentContent()
            .getFirstBlock()
            .getEntityAt(0),
        ).toBe(null)
      })

      it("enabled", () => {
        const contentState = convertFromRaw({
          entityMap: {
            "3": {
              type: "HORIZONTAL_RULE",
              mutability: "IMMUTABLE",
              data: {},
            },
          },
          blocks: [
            {
              key: "epoas",
              text: " ",
              type: "atomic",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 3,
                },
              ],
              data: {},
            },
          ],
        })

        expect(
          normalize
            .filterEntityType(EditorState.createWithContent(contentState), [
              HORIZONTAL_RULE,
            ])
            .getCurrentContent()
            .getFirstBlock()
            .getEntityAt(0),
        ).not.toBe(null)
      })
    })
  })
})
