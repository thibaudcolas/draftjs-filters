import { EditorState, convertFromRaw } from "draft-js"

import { IMAGE, HORIZONTAL_RULE } from "../constants"
import { resetAtomicBlocks, filterEntityType } from "./entities"

describe("entities", () => {
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
        resetAtomicBlocks(EditorState.createWithContent(contentState), [
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
        resetAtomicBlocks(EditorState.createWithContent(contentState), [IMAGE])
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
        resetAtomicBlocks(EditorState.createWithContent(contentState), [IMAGE])
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
          resetAtomicBlocks(EditorState.createWithContent(contentState), [])
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
          resetAtomicBlocks(EditorState.createWithContent(contentState), [
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
        filterEntityType(EditorState.createWithContent(contentState), ["EMBED"])
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
        filterEntityType(EditorState.createWithContent(contentState), ["LINK"])
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
          filterEntityType(EditorState.createWithContent(contentState), [])
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
          filterEntityType(EditorState.createWithContent(contentState), [
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
