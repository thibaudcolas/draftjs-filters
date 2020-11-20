import { EditorState, convertFromRaw, convertToRaw } from "draft-js"

import { filterEditorState } from "./editor"

const preserveAtomicBlocksEntities = {
  0: {
    type: "IMAGE",
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
    data: {
      src: "/1.png",
    },
  },
  236: {
    type: "EMBED",
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
    data: {
      src: "/example.png",
    },
  },
  3: {
    type: "LINK",
    data: {
      url: "www.example.com",
    },
  },
  328: {
    type: "TEST",
    data: {
      url: "doc.pdf",
    },
  },
  512: {
    type: "EMBED",
    data: {
      url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
    },
  },
  1024: {
    type: "IMAGE",
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
})

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
      whitelist: {
        src: "^/",
      },
    },
    {
      type: "LINK",
      attributes: ["url"],
      whitelist: {},
    },
  ],
  maxNesting: 1,
  whitespacedCharacters: ["\n", "\t", "📷"],
}

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
      })
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
})
