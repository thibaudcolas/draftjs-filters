import { EditorState, convertFromRaw } from "draft-js"

import { IMAGE, HORIZONTAL_RULE } from "../constants"
import {
  resetAtomicBlocks,
  filterEntityRanges,
  filterEntityAttributes,
  shouldKeepEntityType,
} from "./entities"
import { shouldRemoveImageEntity } from "../index"

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

  describe("#filterEntityRanges", () => {
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
        filterEntityRanges(
          EditorState.createWithContent(contentState),
          (content, entityKey, block) => {
            const entityType = content.getEntity(entityKey).getType()
            return entityType === "EMBED"
          },
        )
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
        filterEntityRanges(
          EditorState.createWithContent(contentState),
          (content, entityKey, block) => {
            const entityType = content.getEntity(entityKey).getType()
            return entityType === "LINK"
          },
        )
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
  })

  describe("#shouldKeepEntityType", () => {
    it("keep", () => {
      expect(shouldKeepEntityType("LINK", ["LINK", "IMAGE"])).toBe(true)
    })

    it("remove", () => {
      expect(shouldKeepEntityType("TEST", ["LINK", "IMAGE"])).toBe(false)
    })
  })

  describe("#shouldRemoveImageEntity", () => {
    it("keep", () => {
      expect(shouldRemoveImageEntity("IMAGE", "atomic")).toBe(false)
    })

    it("remove (wrong block)", () => {
      expect(shouldRemoveImageEntity("IMAGE", "unstyled")).toBe(true)
    })

    it("not an image - no opinion", () => {
      expect(shouldRemoveImageEntity("TEST", "unstyled")).toBe(false)
    })
  })

  describe("#filterEntityAttributes", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "4": {
            type: "LINK",
            mutability: "MUTABLE",
            data: {
              href: "http://example.com",
              rel: "noreferrer nofollow noopener",
              target: "_blank",
              url: "http://example.com/",
            },
          },
          "5": {
            type: "IMAGE",
            mutability: "MUTABLE",
            data: {
              alt: "",
              height: "15",
              src: "/test/example.png",
              width: "15",
            },
          },
          "6": {
            type: "EMBED",
            mutability: "MUTABLE",
            data: {
              alt: "",
              height: "15",
              src: "/test/example.png",
              width: "15",
            },
          },
        },
        blocks: [
          {
            key: "dffrj",
            text: "link",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
              {
                offset: 0,
                length: 4,
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
            key: "affm5",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 6,
              },
            ],
            data: {},
          },
        ],
      })

      const editorState = filterEntityAttributes(
        EditorState.createWithContent(contentState),
        [
          {
            type: "IMAGE",
            attributes: ["alt", "src"],
          },
          {
            type: "EMBED",
            attributes: [],
          },
          {
            type: "LINK",
            attributes: ["url", "test"],
          },
        ],
      )
      const entities = {}
      editorState
        .getCurrentContent()
        .getBlockMap()
        .forEach((block) => {
          block.findEntityRanges((char) => {
            const entity = editorState
              .getCurrentContent()
              .getEntity(char.getEntity())
            entities[entity.getType()] = entity.getData()
          })
        })

      expect(entities).toEqual({
        IMAGE: {
          alt: "",
          src: "/test/example.png",
        },
        EMBED: {},
        LINK: {
          url: "http://example.com/",
        },
      })
    })
  })
})
