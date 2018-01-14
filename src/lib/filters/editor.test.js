import { EditorState, convertFromRaw, convertToRaw } from "draft-js"

import { filterEditorState } from "./editor"

const preserveAtomicBlocksEntities = {
  "0": {
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

const resetBlockDepth = [
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

const resetBlockType = [
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

const filterInlineStyle = [
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
  "1": {
    type: "IMAGE",
    data: {
      src: "/1.png",
    },
  },
  "236": {
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
  // TODO bug?
  {
    key: "r",
    text: " ",
    type: "atomic",
  },
]

const filterEntityRangesEntities = {
  "2": {
    type: "IMAGE",
    data: {
      src: "/example.png",
    },
  },
  "3": {
    type: "LINK",
    data: {
      url: "www.example.com",
    },
  },
  "328": {
    type: "TEST",
    data: {
      url: "doc.pdf",
    },
  },
  "512": {
    type: "EMBED",
    data: {
      url: "http://www.youtube.com/watch?v=y8Kyi0WNg40",
    },
  },
  "1024": {
    type: "IMAGE",
    data: {
      src: "http://example.com/example.png",
    },
  },
}

const filterEntityRanges = [
  // TODO Bug? Should drop the block if entity type is unsupported.
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
  // TODO Should remove atomic block coming from filtered-out entity.
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

const filterEntityAttributesEntities = {
  "4": {
    type: "LINK",
    data: {
      href: "http://example.com",
      url: "http://example.com/",
    },
  },
}

const filterEntityAttributes = [
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

const whitespaceCharacters = [
  {
    key: "y",
    text: "So\nft",
    type: "unstyled",
  },
  {
    key: "z",
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

describe("editor", () => {
  describe("#filterEditorState", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: Object.assign(
          {},
          preserveAtomicBlocksEntities,
          resetAtomicBlocksEntities,
          filterEntityRangesEntities,
          filterEntityAttributesEntities,
        ),
        blocks: [
          ...preserveAtomicBlocks,
          ...removeInvalidDepthBlocks,
          ...resetBlockDepth,
          ...resetBlockType,
          ...filterInlineStyle,
          ...resetAtomicBlocks,
          ...resetAtomicBlocks,
          ...filterEntityRanges,
          ...filterEntityAttributes,
          ...whitespaceCharacters,
        ],
      })
      const editorState = EditorState.createWithContent(contentState)
      expect(
        convertToRaw(
          filterEditorState({
            editorState,
            maxListNesting: 1,
            enableHorizontalRule: false,
            enableLineBreak: false,
            blockTypes: [
              "unstyled",
              "header-two",
              "header-three",
              "header-four",
              "unordered-list-item",
              "ordered-list-item",
            ],
            inlineStyles: ["BOLD"],
            entityTypes: [
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
          }).getCurrentContent(),
        ),
      ).toMatchSnapshot()
    })

    it("enableHorizontalRule", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState({
          editorState,
          maxListNesting: 1,
          enableHorizontalRule: true,
          enableLineBreak: false,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        }),
      ).toBeInstanceOf(EditorState)
    })

    it("enableLineBreak", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState({
          editorState,
          maxListNesting: 1,
          enableHorizontalRule: false,
          enableLineBreak: true,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        }),
      ).toBeInstanceOf(EditorState)
    })

    it("no normalisation = no change", () => {
      const editorState = EditorState.createEmpty()
      expect(
        filterEditorState({
          editorState,
          maxListNesting: 1,
          enableHorizontalRule: false,
          enableLineBreak: true,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        }),
      ).toBe(editorState)
    })
  })
})
