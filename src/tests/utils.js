import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import snapshotDiff from "snapshot-diff"

import { filterEditorState } from "../lib/index"

// https://github.com/jest-community/snapshot-diff
expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer())

const config = {
  maxListNesting: 4,
  blockTypes: [
    "unstyled",
    "header-two",
    "header-three",
    "header-four",
    "unordered-list-item",
    "ordered-list-item",
  ],
  inlineStyles: ["BOLD", "ITALIC"],
  entityTypes: [
    {
      type: "LINK",
      attributes: ["url"],
      whitelist: {
        href: "^(?!#)",
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
  whitespacedCharacters: ["\t"],
}

export const testFilteringDiff = (raw) => {
  const content = convertFromRaw(raw)
  const editorState = filterEditorState(
    config,
    EditorState.createWithContent(content),
  )

  const filtered = convertToRaw(editorState.getCurrentContent())

  // We snapshot the difference in the content before-after filtering, instead of the resulting content.
  // This makes it easier to review what exactly is filtered out.
  expect(snapshotDiff(raw, filtered)).toMatchSnapshot()
}
