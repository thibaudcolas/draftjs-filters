import { expect } from "vitest"
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  RawDraftContentState,
} from "draft-js"

import { filterEditorState } from "../lib/index"

import snapshotDiff from "./snapshot-diff"

export const config = {
  blocks: [
    "header-two",
    "header-three",
    "header-four",
    "unordered-list-item",
    "ordered-list-item",
  ],
  styles: ["BOLD", "ITALIC"],
  entities: [
    {
      type: "LINK",
      attributes: ["url"],
      allowlist: {
        href: "^(http:|https:|undefined$)",
      },
    },
    {
      type: "IMAGE",
      attributes: ["src"],
      allowlist: {
        src: "^http",
      },
    },
  ],
  maxNesting: 4,
  // Do not filter 📷 here, this will add trailing whitespace to the snapshots.
  whitespacedCharacters: ["\t"],
} as const

export const testFilteringDiff = (raw: object | RawDraftContentState) => {
  const editorState = filterEditorState(
    config,
    EditorState.createWithContent(convertFromRaw(raw as RawDraftContentState)),
  )
  // We snapshot the difference in the content before-after filtering, instead of the resulting content.
  // This makes it easier to review what exactly is filtered out.
  const filteredContent = convertToRaw(editorState.getCurrentContent())
  expect(snapshotDiff(raw, filteredContent)).toMatchSnapshot()
  // Make sure none of the transformations introduce invalid content.
  const filteredTwice = convertToRaw(
    filterEditorState(config, editorState).getCurrentContent(),
  )
  expect(filteredTwice).toEqual(filteredContent)
}
