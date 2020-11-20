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
        entityMap: {
          0: {
            type: "IMAGE",
            data: {},
          },
        },
        blocks: [
          { key: "a", text: "test" },
          { key: "b", text: "· Bullet 0" },
          { key: "c", text: "•\tBullet 0" },
          { key: "d", text: "•Bullet 0" },
          {
            key: "e",
            text: "📷 Bullet 0",
            entityRanges: [
              {
                type: "IMAGE",
                key: 0,
                offset: 0,
                length: 1,
              },
            ],
          },
          { key: "f", text: "\tBullet 0" },
          { key: "g", text: " \tBullet 0" },
          {
            key: "h",
            text: "📷 ",
            entityRanges: [
              {
                type: "IMAGE",
                key: 0,
                offset: 0,
                length: 1,
              },
            ],
          },
          { key: "i", text: "◦Bullet 1" },
          { key: "j", text: "o Bullet 1" },
          { key: "k", text: "o\tBullet 1" },
          { key: "l", text: "§ Bullet 2" },
          { key: "m", text: "\tBullet 2" },
          { key: "n", text: "◾Bullet 2" },
          { key: "o", text: "1. Numbered 0" },
          { key: "p", text: "19. Numbered 0" },
          { key: "q", text: "1.\tNumbered 0" },
          { key: "r", text: "19.\tNumbered 0" },
          { key: "s", text: "i. Numbered 2" },
          { key: "t", text: "xviii. Numbered 2" },
          { key: "u", text: "i.\tNumbered 2" },
          { key: "v", text: "xviii.\tNumbered 2" },
          { key: "w", text: "a. Numbered 1" },
          { key: "x", text: "z. Numbered 1" },
          { key: "y", text: "a.\tNumbered 1" },
          { key: "z", text: "z.\tNumbered 1" },
        ],
      })
      expect(
        convertToRaw(
          preserveBlockByText(
            [
              {
                // https://regexper.com/#%5E(%C2%B7%20%7C%E2%80%A2%5Ct%7C%E2%80%A2%7C%F0%9F%93%B7%20%7C%5Ct%7C%20%5Ct)
                test: "^(· |•\t|•|📷 |\t| \t)",
                type: "unordered-list-item",
                depth: 0,
              },
              // https://regexper.com/#%5E(%E2%97%A6%7Co%20%7Co%5Ct)
              { test: "^(◦|o |o\t)", type: "unordered-list-item", depth: 1 },
              // https://regexper.com/#%5E(%C2%A7%20%7C%EF%82%A7%5Ct%7C%E2%97%BE)
              { test: "^(§ |\t|◾)", type: "unordered-list-item", depth: 2 },
              {
                // https://regexper.com/#%5E1%7B0%2C1%7D%5Cd%5C.%5B%20%5Ct%5D
                test: "^1{0,1}\\d\\.[ \t]",
                type: "ordered-list-item",
                depth: 0,
              },
              {
                // Roman numerals from I to XX.
                // https://regexper.com/#%5Ex%7B0%2C1%7D(i%7Cii%7Ciii%7Civ%7Cv%7Cvi%7Cvii%7Cviii%7Cix%7Cx)%5C.%5B%20%5Ct%5D
                test: "^x{0,1}(i|ii|iii|iv|v|vi|vii|viii|ix|x)\\.[ \t]",
                type: "ordered-list-item",
                depth: 2,
              },
              {
                // There is a clash between this and the i., v., x. roman numerals.
                // Those tests are executed in order though, so the roman numerals take priority.
                // We do not want to match too many letters (say aa.), because those could be actual text.
                // https://regexper.com/#%5E%5Ba-z%5D%5C.%5B%20%5Ct%5D
                test: "^[a-z]\\.[ \t]",
                type: "ordered-list-item",
                depth: 1,
              },
            ],
            content,
          ),
        ),
      ).toMatchSnapshot()
    })

    it("no normalisation = no change", () => {
      const content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            type: "header-one",
            text: "test",
          },
        ],
      })
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
            depth: 1,
          },
          {
            key: "c",
            text: "H1",
            type: "header-one",
          },
          {
            key: "d",
            text: "UL",
            type: "ordered-list-item",
            depth: 1,
          },
        ],
      })

      expect(
        filterBlockTypes(["unordered-list-item"], content)
          .getBlockMap()
          .map((block) => ({
            type: block.getType(),
            depth: block.getDepth(),
          }))
          .toJS(),
      ).toEqual({
        a: { type: "unstyled", depth: 0 },
        b: { type: "unordered-list-item", depth: 1 },
        c: { type: "unstyled", depth: 0 },
        d: { type: "unstyled", depth: 0 },
      })
    })

    it("no normalisation = no change", () => {
      const content = EditorState.createEmpty().getCurrentContent()
      expect(filterBlockTypes([UNSTYLED], content)).toBe(content)
    })
  })
})
