import { EditorState, convertFromRaw, convertToRaw } from "draft-js"

import {
  cloneEntities,
  filterEntityRanges,
  filterEntityData,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  shouldKeepEntityByAttribute,
} from "./entities"

describe("entities", () => {
  describe("#cloneEntities", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {
          1: {
            type: "LINK",
            data: {
              url: "www.example.com",
            },
          },
          2: {
            type: "IMAGE",
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
                key: 2,
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
                key: 2,
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
                key: 1,
              },
              {
                offset: 2,
                length: 2,
                key: 1,
              },
            ],
          },
          {
            key: "d",
            text: "test test",
            type: "unstyled",
            entityRanges: [
              {
                offset: 0,
                length: 4,
                key: 1,
              },
              {
                offset: 5,
                length: 4,
                key: 1,
              },
            ],
          },
        ],
      })

      expect(convertToRaw(cloneEntities(content))).toMatchSnapshot()
    })

    it("no filtering = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(cloneEntities(content)).toBe(content)
    })
  })

  describe("#filterEntityRanges", () => {
    it("works", () => {
      let content = convertFromRaw({
        entityMap: {
          0: {
            type: "LINK",
            data: {
              url: "www.example.com",
            },
          },
          1: {
            type: "TEST",
            data: {
              url: "doc.pdf",
            },
          },
          4: {
            type: "IMAGE",
            data: {
              src: "/example.png",
            },
          },
          5: {
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

      content = filterEntityRanges((content, entityKey, block) => {
        const entityType = content.getEntity(entityKey).getType()
        return ["IMAGE", "LINK"].includes(entityType)
      }, content)

      expect(
        content
          .getBlockMap()
          .map((b) => {
            return b
              .getCharacterList()
              .map((c) => c.getEntity())
              .map((e) => {
                return e ? content.getEntity(e).getType() : null
              })
          })
          .toJS(),
      ).toEqual({
        a: [null],
        b: ["IMAGE"],
        c: ["LINK", "LINK", null, null],
      })
    })

    it("no filtering = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(filterEntityRanges(() => true, content)).toBe(content)
    })
  })

  describe("#shouldKeepEntityType", () => {
    it("keep", () => {
      expect(
        shouldKeepEntityType([{ type: "LINK" }, { type: "IMAGE" }], "LINK"),
      ).toBe(true)
    })

    it("remove", () => {
      expect(
        shouldKeepEntityType([{ type: "LINK" }, { type: "IMAGE" }], "TEST"),
      ).toBe(false)
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

    it("attribute not defined on entities matches undefined", () => {
      expect(
        shouldKeepEntityByAttribute(
          [
            {
              type: "LINK",
              whitelist: {
                href: "^(http:|https:|undefined$)",
              },
            },
          ],
          "LINK",
          {
            url: "http://example.com",
          },
        ),
      ).toBe(true)
    })

    describe("multiple attributes", () => {
      it("valid", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  href: "^(http:|https:|undefined$)",
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
                  href: "^(http:|https:|undefined$)",
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

    describe("attribute presence", () => {
      it("requested, absent", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  id: true,
                },
              },
            ],
            "LINK",
            {},
          ),
        ).toBe(false)
      })

      it("requested, present", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  id: true,
                },
              },
            ],
            "LINK",
            {
              id: "5",
            },
          ),
        ).toBe(true)
      })

      it("requested out, absent", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  id: false,
                },
              },
            ],
            "LINK",
            {},
          ),
        ).toBe(true)
      })

      it("requested out, present", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
                whitelist: {
                  id: false,
                },
              },
            ],
            "LINK",
            {
              id: "5",
            },
          ),
        ).toBe(false)
      })
    })

    describe("defaults", () => {
      it("missing config", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
              },
            ],
            "TEST",
            {},
          ),
        ).toBe(true)
      })

      it("no whitelist", () => {
        expect(
          shouldKeepEntityByAttribute(
            [
              {
                type: "LINK",
              },
            ],
            "LINK",
            {},
          ),
        ).toBe(true)
      })
    })
  })

  describe("#filterEntityData", () => {
    it("works", () => {
      let content = convertFromRaw({
        entityMap: {
          4: {
            type: "LINK",
            data: {
              href: "http://example.com",
              url: "http://example.com/",
            },
          },
          5: {
            type: "IMAGE",
            data: {
              alt: "",
              src: "/test/example.png",
              width: "15",
            },
          },
          6: {
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

      content = filterEntityData(
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
        content,
      )
      const entities = {}
      content.getBlockMap().forEach((block) => {
        block.findEntityRanges((char) => {
          const entity = content.getEntity(char.getEntity())
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

    it("no filtering = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(filterEntityData([], content)).toBe(content)
    })

    describe("defaults", () => {
      it("missing config", () => {
        let content = convertFromRaw({
          entityMap: {
            4: {
              type: "LINK",
              data: {
                url: "http://example.com/",
              },
            },
          },
          blocks: [
            {
              key: "a",
              text: "link",
              entityRanges: [
                {
                  offset: 0,
                  length: 4,
                  key: 4,
                },
              ],
            },
          ],
        })

        content = filterEntityData(
          [
            {
              type: "TEST",
              attributes: ["url", "test"],
            },
          ],
          content,
        )
        const entities = {}
        content.getBlockMap().forEach((block) => {
          block.findEntityRanges((char) => {
            const entity = content.getEntity(char.getEntity())
            entities[entity.getType()] = entity.getData()
          })
        })

        expect(entities).toEqual({
          LINK: {
            url: "http://example.com/",
          },
        })
      })

      it("no whitelist", () => {
        let content = convertFromRaw({
          entityMap: {
            4: {
              type: "LINK",
              data: {
                url: "http://example.com/",
              },
            },
          },
          blocks: [
            {
              key: "a",
              text: "link",
              entityRanges: [
                {
                  offset: 0,
                  length: 4,
                  key: 4,
                },
              ],
            },
          ],
        })

        content = filterEntityData(
          [
            {
              type: "LINK",
            },
          ],
          content,
        )
        const entities = {}
        content.getBlockMap().forEach((block) => {
          block.findEntityRanges((char) => {
            const entity = content.getEntity(char.getEntity())
            entities[entity.getType()] = entity.getData()
          })
        })

        expect(entities).toEqual({
          LINK: {
            url: "http://example.com/",
          },
        })
      })
    })
  })
})
