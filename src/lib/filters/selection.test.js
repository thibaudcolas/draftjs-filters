import { EditorState, convertFromRaw } from "draft-js"

import {
  removeInvalidDepthBlocks,
  preserveAtomicBlocks,
  resetAtomicBlocks,
  filterEntityRanges,
  removeInvalidAtomicBlocks,
} from "../index"
import { applyContentWithSelection } from "./selection"

describe("selection", () => {
  describe("#applyContentWithSelection", () => {
    const filters = [
      // 1. clean up blocks.
      removeInvalidDepthBlocks,
      // 4. Process atomic blocks before processing entities.
      preserveAtomicBlocks,
      resetAtomicBlocks,
      // 5. Remove entity ranges (and linked entities)
      filterEntityRanges.bind(null, () => false),
      // 6. Remove/filter entity-related matters.
      removeInvalidAtomicBlocks.bind(null, [
        {
          type: "IMAGE",
          attributes: ["src"],
          whitelist: {
            src: "^http",
          },
        },
      ]),
    ]

    it("does not alter editorState if content is the same before / after filters", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "f8beh",
            text: "test",
            depth: 3,
          },
        ],
      })
      const editorState = EditorState.createWithContent(content)

      expect(applyContentWithSelection(editorState, content, content)).toBe(
        editorState,
      )
    })

    it("inserts a block if there is none left, with selection on it", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {},
          blocks: [
            {
              key: "f8beh",
              text: "test",
              depth: 3,
            },
          ],
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )
      const block = nextState.getCurrentContent().getFirstBlock()

      expect(block.toJS()).toMatchObject({
        text: "",
        type: "unstyled",
        depth: 0,
      })

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: 0,
      })
    })

    it("does not change selection if valid", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {},
          blocks: [
            {
              key: "f8beh",
              text: "  ",
            },
            {
              key: "35q1g",
              text: "Test",
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "35q1g",
          focusKey: "35q1g",
          anchorOffset: 4,
          focusOffset: 4,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "35q1g",
        anchorOffset: 4,
        focusKey: "35q1g",
        focusOffset: 4,
      })
    })

    it("does not change selection if not collapsed", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {
            "0": {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {
                src: "file://localhost/clip_image002.png",
              },
            },
          },
          blocks: [
            {
              key: "f8beh",
              text: "  ",
            },
            {
              key: "35q1g",
              text: "Test",
            },
            {
              key: "82iof",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "35q1g",
          focusKey: "82iof",
          anchorOffset: 0,
          focusOffset: 1,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "35q1g",
        anchorOffset: 0,
        focusKey: "82iof",
        focusOffset: 1,
      })
    })

    it("works for the last block", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {
            "0": {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {
                src: "file://localhost/clip_image002.png",
              },
            },
          },
          blocks: [
            {
              key: "f8beh",
              text: "  ",
            },
            {
              key: "35q1g",
              text: "Test",
            },
            {
              key: "82iof",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "82iof",
          focusKey: "82iof",
          anchorOffset: 1,
          focusOffset: 1,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "35q1g",
        anchorOffset: 4,
        focusKey: "35q1g",
        focusOffset: 4,
      })
    })

    it("works on a random block", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {
            "0": {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {
                src: "file://localhost/clip_image002.png",
              },
            },
          },
          blocks: [
            {
              key: "f8beh",
              text: "  ",
            },
            {
              key: "35q1g",
              text: "Test",
            },
            {
              key: "82iof",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
            {
              key: "35q1h",
              text: "Test",
            },

            {
              key: "35q1d",
              text: "Test",
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "82iof",
          focusKey: "82iof",
          anchorOffset: 1,
          focusOffset: 1,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "35q1g",
        anchorOffset: 4,
        focusKey: "35q1g",
        focusOffset: 4,
      })
    })

    it("works with multiple blocks removed", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {
            "0": {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {
                src: "file://localhost/clip_image002.png",
              },
            },
          },
          blocks: [
            {
              key: "f8beh",
              text: "  ",
            },
            {
              key: "82ioh",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
            {
              key: "35q1g",
              text: "Test",
            },
            {
              key: "82iof",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
            {
              key: "35q1h",
              text: "Test",
            },
            {
              key: "35q1d",
              text: "Test",
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "82iof",
          focusKey: "82iof",
          anchorOffset: 1,
          focusOffset: 1,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "35q1g",
        anchorOffset: 4,
        focusKey: "35q1g",
        focusOffset: 4,
      })
    })

    it("works with consecutive blocks removed", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {
            "0": {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {
                src: "file://localhost/clip_image002.png",
              },
            },
          },
          blocks: [
            {
              key: "f8beh",
              text: "  ",
            },
            {
              key: "35q1g",
              text: "Test",
            },
            {
              key: "82ioh",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
            {
              key: "82iof",
              text: "📷",
              entityRanges: [
                {
                  offset: 0,
                  length: 1,
                  key: 0,
                },
              ],
            },
            {
              key: "35q1h",
              text: "Test",
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "82iof",
          focusKey: "82iof",
          anchorOffset: 1,
          focusOffset: 1,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "35q1g",
        anchorOffset: 4,
        focusKey: "35q1g",
        focusOffset: 4,
      })
    })

    it("fail-safe if new selection location cannot be determined", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {},
          blocks: [
            {
              key: "f8beh",
              text: "  ",
              depth: 3,
            },
            {
              key: "35q1g",
              text: "Test",
            },
          ],
        }),
      )
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: "abcde",
          focusKey: "abcde",
          anchorOffset: 4,
          focusOffset: 4,
        }),
      )

      const content = editorState.getCurrentContent()
      const nextContent = filters.reduce((c, filter) => filter(c), content)
      const nextState = applyContentWithSelection(
        editorState,
        content,
        nextContent,
      )

      expect(nextState.getSelection().toJS()).toMatchObject({
        anchorKey: "abcde",
        anchorOffset: 4,
        focusKey: "abcde",
        focusOffset: 4,
      })
    })
  })
})
