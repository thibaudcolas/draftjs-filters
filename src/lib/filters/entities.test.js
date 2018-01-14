import { EditorState, convertFromRaw } from "draft-js"

import { IMAGE, HORIZONTAL_RULE } from "../constants"
import {
  resetAtomicBlocks,
  filterEntityRanges,
  filterEntityAttributes,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  shouldKeepEntityByAttribute,
} from "./entities"

describe("entities", () => {
  describe("#resetAtomicBlocks", () => {
    it("works", () => {
      const contentState = convertFromRaw({
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
          {
            key: "c",
            text: " ",
            type: "atomic",
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
            type: "atomic",
          },
        ],
      })

      expect(
        resetAtomicBlocks(EditorState.createWithContent(contentState), [IMAGE])
          .getCurrentContent()
          .getBlockMap()
          .map((b) => ({
            text: b.getText(),
            type: b.getType(),
            style: b.getInlineStyleAt(0).size,
          }))
          .toJS(),
      ).toEqual({
        a: { text: " ", type: "atomic", style: 0 },
        b: { text: " ", type: "atomic", style: 0 },
        c: { text: " ", type: "unstyled", style: 0 },
        // TODO bug?
        d: { text: " ", type: "atomic", style: 0 },
      })
    })
  })

  describe("#filterEntityRanges", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "0": {
            type: "LINK",
            data: {
              url: "www.example.com",
            },
          },
          "1": {
            type: "TEST",
            data: {
              url: "doc.pdf",
            },
          },
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
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 5,
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
          },
          {
            key: "c",
            text: "test",
            type: "unstyled",
            entityRanges: [
              {
                offset: 0,
                length: 2,
                key: 0,
              },
              {
                offset: 2,
                length: 2,
                key: 1,
              },
            ],
          },
        ],
      })

      expect(
        filterEntityRanges(
          EditorState.createWithContent(contentState),
          (content, entityKey, block) => {
            const entityType = content.getEntity(entityKey).getType()
            return ["IMAGE", "LINK"].includes(entityType)
          },
        )
          .getCurrentContent()
          .getBlockMap()
          .map((b) => {
            return b
              .getCharacterList()
              .map((c) => c.getEntity())
              .map((e) => {
                return e ? contentState.getEntity(e).getType() : null
              })
          })
          .toJS(),
      ).toEqual({
        a: [null],
        b: ["IMAGE"],
        c: ["LINK", "LINK", null, null],
      })
    })
  })

  describe("#shouldKeepEntityType", () => {
    it("keep", () => {
      expect(shouldKeepEntityType(["LINK", "IMAGE"], "LINK")).toBe(true)
    })

    it("remove", () => {
      expect(shouldKeepEntityType(["LINK", "IMAGE"], "TEST")).toBe(false)
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

  describe("#shouldKeepEntityByAttribute", () => {
    it("valid", () => {
      expect(
        shouldKeepEntityByAttribute(
          [
            {
              type: "IMAGE",
              whitelist: {
                src: "^/",
              },
            },
          ],
          "IMAGE",
          {
            src: "/test/example.png",
          },
        ),
      ).toBe(true)
    })

    it("invalid", () => {
      expect(
        shouldKeepEntityByAttribute(
          [
            {
              type: "IMAGE",
              whitelist: {
                src: "^/",
              },
            },
          ],
          "IMAGE",
          {
            src: "http://example.com/test.png",
          },
        ),
      ).toBe(false)
    })

    describe("multiple attributes", () => {
      it("valid", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  href: "^(?!#)",
                  target: "_blank",
                },
              },
            ],
            "LINK",
            {
              href: "http://localhost/",
              target: "_blank",
            },
          ),
        ).toBe(true)
      })

      it("invalid", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  href: "^(?!#)",
                  target: "_blank",
                },
              },
            ],
            "LINK",
            {
              href: "#_msocom_1",
              target: "_blank",
            },
          ),
        ).toBe(false)
      })
    })
  })

  describe("#filterEntityAttributes", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          "4": {
            type: "LINK",
            data: {
              href: "http://example.com",
              url: "http://example.com/",
            },
          },
          "5": {
            type: "IMAGE",
            data: {
              alt: "",
              src: "/test/example.png",
              width: "15",
            },
          },
          "6": {
            type: "EMBED",
            data: {
              url: "http://example.com/",
            },
          },
        },
        blocks: [
          {
            key: "a",
            text: "link",
            type: "unstyled",
            entityRanges: [
              {
                offset: 0,
                length: 4,
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
                key: 5,
              },
            ],
          },
          {
            key: "c",
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 6,
              },
            ],
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
