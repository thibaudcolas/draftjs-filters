import { EditorState, convertFromRaw, convertToRaw } from "draft-js"

import { filterEditorState } from "../lib/index"

import { config } from "./utils"

const rawContent = {
  entityMap: {
    "0": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "http://example.com/",
      },
    },
    "1": {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: "http://example.com/",
      },
    },
    "2": {
      type: "IMAGE",
      mutability: "IMMUTABLE",
      data: {
        src:
          "https://thibaudcolas.github.io/draftjs-filters/word-toolbars-overload.jpg",
      },
    },
  },
  blocks: [
    {
      key: "b4b1l",
      text: "Inline styles",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "drvrf",
      text: "Unstyled, bold, italic, bold italic, strikethrough, unstyled",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 10,
          length: 4,
          style: "BOLD",
        },
        {
          offset: 24,
          length: 11,
          style: "BOLD",
        },
        {
          offset: 16,
          length: 6,
          style: "ITALIC",
        },
        {
          offset: 24,
          length: 11,
          style: "ITALIC",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "89sll",
      text: "Unstyled",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "208o1",
      text: "Inline entities",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "abhp9",
      text: "Unstyled, link bold link",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 15,
          length: 9,
          style: "BOLD",
        },
      ],
      entityRanges: [
        {
          offset: 10,
          length: 4,
          key: 0,
        },
        {
          offset: 15,
          length: 9,
          key: 1,
        },
      ],
      data: {},
    },
    {
      key: "9nobu",
      text: "Text blocks",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "94es7",
      text: "Unstyled",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "60adn",
      text: "h2 - Heading two bold",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 17,
          length: 4,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "fqqmr",
      text: "h3 - Heading three",
      type: "header-three",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "5cphe",
      text: "h4 - heading four",
      type: "header-four",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "aaecs",
      text: "Bulleted list",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "50cvd",
      text: "Bulleted list",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "1qdtc",
      text: "Nested bulleted list (1)",
      type: "unordered-list-item",
      depth: 1,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "bu2n4",
      text: "Nested bulleted list (2)",
      type: "unordered-list-item",
      depth: 2,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "6nb8n",
      text: "Bulleted list",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "dvujg",
      text: "Numbered list",
      type: "ordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9prm6",
      text: "Numbered list",
      type: "ordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "cvsob",
      text: "Nested numbered list (1)",
      type: "ordered-list-item",
      depth: 1,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "cdrds",
      text: "Nested numbered list (2)",
      type: "ordered-list-item",
      depth: 2,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "724a8",
      text: "Numbered list",
      type: "ordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "edbt8",
      text: "Rich blocks",
      type: "header-two",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "br92g",
      text: "Image",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 5,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "2qs97",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 2,
        },
      ],
      data: {},
    },
    {
      key: "2s0v1",
      text: "Misc",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 4,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "89ckm",
      text: "Soft\nLine break",
      type: "unordered-list-item",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "b36gs",
      text: "Emojis",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 6,
          style: "BOLD",
        },
      ],
      entityRanges: [],
      data: {},
    },
    {
      key: "7ag50",
      text: "🙂, 😨, 😎",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
}

describe("No paste", () => {
  it("does not alter content entered manually", () => {
    const editorState = filterEditorState(
      config,
      EditorState.createWithContent(convertFromRaw(rawContent)),
    )

    expect(convertToRaw(editorState.getCurrentContent())).toEqual(rawContent)
  })
})
