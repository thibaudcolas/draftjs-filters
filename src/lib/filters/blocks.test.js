import { EditorState, convertFromRaw, convertToRaw } from "draft-js"

import { UNSTYLED } from "../constants"
import {
  removeInvalidDepthBlocks,
  preserveBlockByText,
  limitBlockDepth,
  filterBlockTypes,
} from "./blocks"

describe("blocks", () => {
  describe("#removeInvalidDepthBlocks", () => {
    it("normalises depth to a given number", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "0",
            type: "ordered-list-item",
            depth: 0,
          },
          {
            key: "b",
            text: "1",
            type: "unstyled",
            depth: 1,
          },
          {
            key: "c",
            text: "2",
            type: "unordered-list-item",
            depth: 2,
          },
        ],
      })

      expect(
        removeInvalidDepthBlocks(content)
          .getBlockMap()
          .map((block) => block.getDepth())
          .toJS(),
      ).toEqual({ a: 0, c: 2 })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(removeInvalidDepthBlocks(content)).toBe(content)
    })
  })

  describe("#limitBlockDepth", () => {
    it("normalises depth to a given number", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "0",
            type: "unordered-list-item",
            depth: 0,
          },
          {
            key: "b",
            text: "1",
            type: "unordered-list-item",
            depth: 1,
          },
          {
            key: "c",
            text: "2",
            type: "unordered-list-item",
            depth: 2,
          },
        ],
      })
      expect(
        limitBlockDepth(1, content)
          .getBlockMap()
          .map((block) => block.getDepth())
          .toJS(),
      ).toEqual({ a: 0, b: 1, c: 1 })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(limitBlockDepth(1, content)).toBe(content)
    })
  })

  describe("#preserveBlockByText", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "test",
            type: "unstyled",
          },
          {
            key: "b",
            text: "· Bullet 0",
            type: "unstyled",
          },
          {
            key: "c",
            text: "o\tBullet 1",
            type: "unstyled",
          },
          {
            key: "d",
            text: "◾Bullet 2",
            type: "unstyled",
          },
          {
            key: "e",
            text: "1. Numbered 1",
            type: "unstyled",
          },
          {
            key: "f",
            text: "a. Numbered 2",
            type: "unstyled",
          },
        ],
      })
      expect(
        convertToRaw(
          preserveBlockByText(
            // WIP. Some of those replacements could be dangerous.
            [
              // https://regexper.com/#%5E(%C2%B7%20%7C%E2%80%A2%5Ct%7C%E2%80%A2%7C%F0%9F%93%B7%20%7C%5Ct%7C%20%5Ct)
              {
                type: "unordered-list-item",
                test: "^(· |•\t|•|📷 |\t| \t)",
                depth: 0,
              },
              { type: "unordered-list-item", test: "^(◦|o |o\t)", depth: 1 },
              { type: "unordered-list-item", test: "^(§ |\t|◾)", depth: 2 },
              // https://regexper.com/#%5E(%5Cd%2B%5C.%5B%20%5Ct%5D)
              { type: "ordered-list-item", test: "^\\d+\\.[ \t]", depth: 0 },
              {
                type: "ordered-list-item",
                // Roman numerals from I to XXX.
                test: "^x{0,2}(i|ii|iii|iv|v|vi|vii|viii|ix|x)\\.[ \t]",
                depth: 2,
              },
              {
                type: "ordered-list-item",
                // There is a clash between this and the i. roman numeral. Those tests are executed in order though.
                test: "^[a-z]\\.[ \t]",
                depth: 1,
              },
            ],
            content,
          ),
        ),
      ).toMatchSnapshot()
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(preserveBlockByText([], content)).toBe(content)
    })
  })

  describe("#filterBlockTypes", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "P",
          },
          {
            key: "b",
            text: "UL",
            type: "unordered-list-item",
          },
          {
            key: "c",
            text: "H1",
            type: "header-one",
          },
        ],
      })

      expect(
        filterBlockTypes(["unordered-list-item"], content)
          .getBlockMap()
          .map((block) => block.getType())
          .toJS(),
      ).toEqual({
        a: "unstyled",
        b: "unordered-list-item",
        c: "unstyled",
      })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(filterBlockTypes([UNSTYLED], content)).toBe(content)
    })
  })
})
