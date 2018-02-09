import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import snapshotDiff from "snapshot-diff"

import { filterEditorState } from "../lib/index"

// https://github.com/jest-community/snapshot-diff
expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer())

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
      whitelist: {
        href: "^(http:|https:|undefined$)",
      },
    },
    {
      type: "IMAGE",
      attributes: ["src"],
      whitelist: {
        src: "^http",
      },
    },
  ],
  maxNesting: 4,
  // Do not filter 📷 here, this will add trailing whitespace to the snapshots.
  whitespacedCharacters: ["\t"],
}

export const testFilteringDiff = (raw) => {
  const editorState = filterEditorState(
    config,
    EditorState.createWithContent(convertFromRaw(raw)),
  )

  // We snapshot the difference in the content before-after filtering, instead of the resulting content.
  // This makes it easier to review what exactly is filtered out.
  expect(
    snapshotDiff(raw, convertToRaw(editorState.getCurrentContent())),
  ).toMatchSnapshot()

  // Make sure none of the transformations introduce invalid content.
  expect(editorState === filterEditorState(config, editorState)).toBe(true)
}
