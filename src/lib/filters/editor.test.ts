import { describe, it, expect } from "vitest"
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  RawDraftContentState,
  ContentState,
  convertFromHTML,
} from "draft-js"

import { filterEditorState, condenseBlocks } from "./editor"

const preserveAtomicBlocksEntities = {
  0: {
    type: "IMAGE",
    mutability: "IMMUTABLE",
    data: {
      src: "/0.png",
    },
  },
}

const preserveAtomicBlocks = [
  {
    key: "a",
    text: " ",
    entityRanges: [
      {
        offset: 0,
        length: 1,
        key: 0,
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
        key: 0,
      },
    ],
  },
  {
    key: "c",
    text: " ",
  },
  {
    key: "d",
    text: "📷 Star list",
    entityRanges: [
      {
        offset: 0,
        length: 1,
        key: 0,
      },
    ],
  },
]

const removeInvalidDepthBlocks = [
  {
    key: "e",
    text: "0",
    type: "ordered-list-item",
    depth: 0,
  },
  {
    key: "f",
    text: "1",
    depth: 1,
  },
  {
    key: "g",
    text: "2",
    type: "unordered-list-item",
    depth: 2,
  },
]

const limitBlockDepth = [
  {
    key: "h",
    text: "0",
    type: "unordered-list-item",
    depth: 0,
  },
  {
    key: "i",
    text: "1",
    type: "unordered-list-item",
    depth: 1,
  },
  {
    key: "j",
    text: "2",
    type: "unordered-list-item",
    depth: 2,
  },
]

const filterBlockTypes = [
  {
    key: "k",
    text: "P",
  },
  {
    key: "l",
    text: "UL",
    type: "unordered-list-item",
  },
  {
    key: "m",
    text: "H1",
    type: "header-one",
  },
]

const filterInlineStyles = [
  {
    key: "n",
    text: "tes",
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
  },
]

const resetAtomicBlocksEntities = {
  1: {
    type: "IMAGE",
    mutability: "IMMUTABLE",
    data: {
      src: "/1.png",
    },
  },
  236: {
    type: "EMBED",
    mutability: "IMMUTABLE",
    data: {
      url: "http://www.youtube.com/watch?v=2",
    },
  },
}

const resetAtomicBlocks = [
  {
    key: "o",
    text: "📷",
    type: "atomic",
    entityRanges: [
      {
        offset: 0,
        length: 1,
        key: 1,
      },
    ],
  },
  {
    key: "p",
    text: " ",
    type: "atomic",
    entityRanges: [
      {
        offset: 0,
        length: 1,
        key: 1,
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
]

const removeInvalidAtomicBlocks = [
  {
    key: "q",
    text: " ",
    type: "atomic",
    entityRanges: [
      {
        offset: 0,
        length: 1,
        key: 236,
      },
    ],
  },
  {
    key: "r",
    text: " ",
    type: "atomic",
  },
]

const filterEntityRangesEntities = {
  2: {
    type: "IMAGE",
    mutability: "IMMUTABLE",
    data: {
      src: "/example.png",
    },
  },
  3: {
    type: "LINK",
    mutability: "IMMUTABLE",
    data: {
      url: "www.example.com",
    },
  },
  328: {
    type: "TEST",
    mutability: "IMMUTABLE",
    data: {
      url: "doc.pdf",
    },
  },
  512: {
    type: "EMBED",
    mutability: "IMMUTABLE",
    data: {
      url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
    },
  },
  1024: {
    type: "IMAGE",
    mutability: "IMMUTABLE",
    data: {
      src: "http://example.com/example.png",
    },
  },
}

const filterEntityRanges = [
  {
    key: "s",
    text: " ",
    type: "atomic",
    entityRanges: [
      {
        offset: 0,
        length: 1,
        key: 512,
      },
    ],
  },
  {
    key: "t",
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
    key: "u",
    text: "test",
    type: "unstyled",
    entityRanges: [
      {
        offset: 0,
        length: 2,
        key: 3,
      },
      {
        offset: 2,
        length: 2,
        key: 328,
      },
    ],
  },
  {
    key: "v",
    text: "shouldRemoveImageEntity ",
    type: "unstyled",
    entityRanges: [
      {
        offset: 23,
        length: 1,
        key: 2,
      },
    ],
  },
  {
    key: "w",
    text: " ",
    type: "atomic",
    entityRanges: [
      {
        offset: 23,
        length: 1,
        key: 1024,
      },
    ],
  },
]

const filterEntityDataEntities = {
  4: {
    type: "LINK",
    mutability: "IMMUTABLE",
    data: {
      href: "http://example.com",
      url: "http://example.com/",
    },
  },
}

const filterEntityData = [
  {
    key: "x",
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
]

const cloneEntitiesEntities = {
  5: {
    type: "LINK",
    mutability: "IMMUTABLE",
    data: {},
  },
}

const cloneEntities = [
  {
    key: "y",
    text: "link link",
    type: "unstyled",
    entityRanges: [
      {
        offset: 0,
        length: 4,
        key: 5,
      },
      {
        offset: 5,
        length: 4,
        key: 5,
      },
    ],
  },
]

const replaceTextBySpaces = [
  {
    key: "z",
    text: "So\nft",
    type: "unstyled",
  },
  {
    key: "aa",
    text: "Ta\tbs",
    type: "unstyled",
    inlineStyleRanges: [
      {
        offset: 0,
        length: 3,
        style: "BOLD",
      },
    ],
  },
]

const preserveBlockByTextEntities = {
  6: {
    type: "IMAGE",
    mutability: "IMMUTABLE",
    data: {},
  },
}

const preserveBlockByText = [
  { key: "ab", text: "· Bullet 0" },
  {
    key: "ac",
    text: "📷 Bullet 0",
    entityRanges: [
      {
        key: 0,
        offset: 0,
        length: 1,
      },
    ],
  },
  {
    key: "ad",
    text: "📷 ",
    entityRanges: [
      {
        key: 0,
        offset: 0,
        length: 1,
      },
    ],
  },
  { key: "ae", text: "◦Bullet 1" },
  { key: "af", text: "§ Bullet 2" },
  { key: "ag", text: "1. Numbered 0" },
  { key: "ah", text: "i. Numbered 2" },
  { key: "ai", text: "a. Numbered 1" },
]

const content = convertFromRaw({
  entityMap: Object.assign(
    {},
    preserveAtomicBlocksEntities,
    preserveBlockByTextEntities,
    resetAtomicBlocksEntities,
    filterEntityRangesEntities,
    filterEntityDataEntities,
    cloneEntitiesEntities,
  ),
  blocks: [
    ...preserveAtomicBlocks,
    ...removeInvalidDepthBlocks,
    ...preserveBlockByText,
    ...limitBlockDepth,
    ...filterBlockTypes,
    ...filterInlineStyles,
    ...resetAtomicBlocks,
    ...removeInvalidAtomicBlocks,
    ...filterEntityRanges,
    ...filterEntityData,
    ...cloneEntities,
    ...replaceTextBySpaces,
  ],
} as unknown as RawDraftContentState)

const filters = {
  blocks: [
    "header-two",
    "header-three",
    "header-four",
    "unordered-list-item",
    "ordered-list-item",
  ],
  styles: ["BOLD"],
  entities: [
    {
      type: "IMAGE",
      attributes: ["src"],
      allowlist: {
        src: "^/",
      },
    },
    {
      type: "LINK",
      attributes: ["url"],
      allowlist: {},
    },
  ],
  maxNesting: 1,
  whitespacedCharacters: ["\n", "\t", "📷"],
} as const

describe("editor", () => {
  describe("#filterEditorState", () => {
    it("works", () => {
      expect(
        convertToRaw(
          filterEditorState(
            filters,
            EditorState.createWithContent(content),
          ).getCurrentContent(),
        ),
      ).toMatchSnapshot()
    })

    it("no normalisation = no change", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState(
          {
            blocks: [],
            styles: [],
            entities: [],
            maxNesting: 1,
            whitespacedCharacters: [],
          },
          editorState,
        ) === editorState,
      ).toBe(true)
    })

    // If the filtering operation order is wrong, it can introduce unwanted content
    // during the filtering, which would be filtered in a re-run (second paste).
    // We run the filter twice in a row and make sure the second output is equal to the first.
    describe("does not introduce filterable content during filtering", () => {
      it("works", () => {
        const filteredState = filterEditorState(
          filters,
          EditorState.createWithContent(content),
        )
        expect(filterEditorState(filters, filteredState)).toBe(filteredState)
      })

      it("in particular with list items", () => {
        const emptyConfig = {
          blocks: [],
          styles: [],
          entities: [],
          maxNesting: 1,
          whitespacedCharacters: [],
        }
        const filteredState = filterEditorState(
          emptyConfig,
          EditorState.createWithContent(
            convertFromRaw({
              entityMap: {},
              blocks: [
                {
                  key: "a",
                  text: "o List item",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                },
              ],
            }),
          ),
        )

        expect(
          convertToRaw(
            filterEditorState(emptyConfig, filteredState).getCurrentContent(),
          ),
        ).toEqual(convertToRaw(filteredState.getCurrentContent()))
      })
    })

    it("#blockTextRules can be overriden (#65)", () => {
      const content = convertFromRaw({
        entityMap: { ...preserveBlockByTextEntities },
        blocks: [...preserveBlockByText],
      } as unknown as RawDraftContentState)
      expect(
        convertToRaw(
          filterEditorState(
            {
              ...filters,
              whitespacedCharacters: [],
              blockTextRules: [],
            },
            EditorState.createWithContent(content),
          ).getCurrentContent(),
        ),
      ).toEqual(convertToRaw(content))
    })
  })

  describe("#condenseBlocks", () => {
    it("works", () => {
      expect(
        convertToRaw(
          condenseBlocks(
            EditorState.createWithContent(content),
            EditorState.createWithContent(content),
          ).getCurrentContent(),
        ).blocks,
      ).toHaveLength(1)
    })

    it("skips any changes for single-block content", () => {
      const editorState = condenseBlocks(
        EditorState.createWithContent(content),
        EditorState.createWithContent(content),
      )
      expect(condenseBlocks(editorState, editorState)).toBe(editorState)
    })

    it("uses the key of the last block", () => {
      const editorState = EditorState.createWithContent(content)
      expect(
        condenseBlocks(editorState, editorState)
          .getCurrentContent()
          .getFirstBlock()
          .getKey(),
      ).toBe(editorState.getCurrentContent().getLastBlock().getKey())
    })

    it("adds spaces between collapsed blocks", () => {
      const content = ContentState.createFromText("this\nworks\nwell")
      const editorState = EditorState.createWithContent(content)
      expect(
        convertToRaw(
          condenseBlocks(editorState, editorState).getCurrentContent(),
        ).blocks[0].text,
      ).toBe("this works well")
    })

    it("gives in-between spaces the styles of the following character", () => {
      const content = ContentState.createFromBlockArray(
        convertFromHTML("<p><b>k</b></p><i>o</i></p>").contentBlocks,
      )
      const editorState = EditorState.createWithContent(content)
      expect(
        condenseBlocks(editorState, editorState)
          .getCurrentContent()
          .getFirstBlock()
          .getCharacterList()
          .map((t) => t!.getStyle().toJS()[0])
          .toJS(),
      ).toEqual(["BOLD", "ITALIC", "ITALIC"])
    })

    it("gives in-between spaces the entity of the following character", () => {
      const content = ContentState.createFromBlockArray(
        convertFromHTML("<p>k</p><a href='https://w'>o</a></p>").contentBlocks,
      )
      const editorState = EditorState.createWithContent(content)
      expect(
        condenseBlocks(editorState, editorState)
          .getCurrentContent()
          .getFirstBlock()
          .getCharacterList()
          .map((t) => !!t!.getEntity())
          .toJS(),
      ).toEqual([false, true, true])
    })

    it("skips atomic blocks", () => {
      const content = ContentState.createFromBlockArray(
        convertFromHTML("<p>k</p><img src='https://w/test.png'><p>o</p>")
          .contentBlocks,
      )
      const editorState = filterEditorState(
        filters,
        EditorState.createWithContent(content),
      )
      expect(
        convertToRaw(
          condenseBlocks(editorState, editorState).getCurrentContent(),
        )
          .blocks.map((t) => t.text)
          .join(""),
      ).toBe("k o")
    })

    it("moves a collapsed selection to the expected end-of-paste marker", () => {
      let prevState = EditorState.createWithContent(
        ContentState.createFromText("test"),
      )
      prevState = EditorState.set(prevState, {
        selection: prevState.getSelection().merge({
          anchorOffset: 4,
          focusOffset: 4,
        }),
      })
      let editorState = EditorState.createWithContent(
        ContentState.createFromText("test\nthis works"),
      )
      const key = editorState.getCurrentContent().getLastBlock().getKey()
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: key,
          focusKey: key,
          anchorOffset: 10,
          focusOffset: 10,
        }),
      )
      editorState = condenseBlocks(editorState, prevState)
      expect(editorState.getSelection().toJS()).toMatchObject({
        anchorKey: key,
        anchorOffset: 15,
        focusKey: key,
        focusOffset: 15,
      })
    })

    it("moves a forwards selection to the expected end-of-paste marker", () => {
      let prevState = EditorState.createWithContent(
        ContentState.createFromText("test"),
      )
      prevState = EditorState.set(prevState, {
        selection: prevState.getSelection().merge({
          anchorOffset: 1,
          focusOffset: 4,
        }),
      })
      let editorState = EditorState.createWithContent(
        ContentState.createFromText("t\nthis\nworks"),
      )
      const key = editorState.getCurrentContent().getLastBlock().getKey()
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: key,
          focusKey: key,
          anchorOffset: 5,
          focusOffset: 5,
        }),
      )
      editorState = condenseBlocks(editorState, prevState)
      expect(editorState.getSelection().toJS()).toMatchObject({
        anchorKey: key,
        anchorOffset: 12,
        focusKey: key,
        focusOffset: 12,
      })
    })

    it("moves a backwards selection to the expected end-of-paste marker", () => {
      let prevState = EditorState.createWithContent(
        ContentState.createFromText("test"),
      )
      prevState = EditorState.set(prevState, {
        selection: prevState.getSelection().merge({
          anchorOffset: 4,
          focusOffset: 1,
        }),
      })
      let editorState = EditorState.createWithContent(
        ContentState.createFromText("t\nthis\nworks"),
      )
      const key = editorState.getCurrentContent().getLastBlock().getKey()
      editorState = EditorState.acceptSelection(
        editorState,
        editorState.getSelection().merge({
          anchorKey: key,
          focusKey: key,
          anchorOffset: 5,
          focusOffset: 5,
        }),
      )
      editorState = condenseBlocks(editorState, prevState)
      expect(editorState.getSelection().toJS()).toMatchObject({
        anchorKey: key,
        anchorOffset: 12,
        focusKey: key,
        focusOffset: 12,
      })
    })
  })
})
