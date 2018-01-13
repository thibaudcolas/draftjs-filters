import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import snapshotDiff from "snapshot-diff"

import { filterEditorState } from "../lib/index"

// https://github.com/jest-community/snapshot-diff
expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer())

const data = {
  "applepages-chrome62-macos1013": require("../../pasting/applepages-chrome62-macos1013.json"),
  "applepages-firefox57-macos1013": require("../../pasting/applepages-firefox57-macos1013.json"),
  "applepages-safari-ios11": require("../../pasting/applepages-safari-ios11.json"),
  "applepages-safari11-macos1013": require("../../pasting/applepages-safari11-macos1013.json"),
  "dropboxpaper-chrome62-macos1013": require("../../pasting/dropboxpaper-chrome62-macos1013.json"),
  "dropboxpaper-chrome62-win81": require("../../pasting/dropboxpaper-chrome62-win81.json"),
  "dropboxpaper-edge16-win10": require("../../pasting/dropboxpaper-edge16-win10.json"),
  "dropboxpaper-firefox57-macos1013": require("../../pasting/dropboxpaper-firefox57-macos1013.json"),
  "dropboxpaper-firefox57-win81": require("../../pasting/dropboxpaper-firefox57-win81.json"),
  "dropboxpaper-ie11-unsupported-strippastedstyles-win81": require("../../pasting/dropboxpaper-ie11-unsupported-strippastedstyles-win81.json"),
  "dropboxpaper-ie11-unsupported-win81": require("../../pasting/dropboxpaper-ie11-unsupported-win81.json"),
  "dropboxpaper-safari-ios11": require("../../pasting/dropboxpaper-safari-ios11.json"),
  "dropboxpaper-safari11-macos1013": require("../../pasting/dropboxpaper-safari11-macos1013.json"),
  "googledocs-chrome62-macos1013": require("../../pasting/googledocs-chrome62-macos1013.json"),
  "googledocs-chrome62-win81": require("../../pasting/googledocs-chrome62-win81.json"),
  "googledocs-edge16-win10": require("../../pasting/googledocs-edge16-win10.json"),
  "googledocs-firefox57-macos1013": require("../../pasting/googledocs-firefox57-macos1013.json"),
  "googledocs-firefox57-win81": require("../../pasting/googledocs-firefox57-win81.json"),
  "googledocs-ie11-strippastedstyles-win81": require("../../pasting/googledocs-ie11-strippastedstyles-win81.json"),
  "googledocs-ie11-win81": require("../../pasting/googledocs-ie11-win81.json"),
  "googledocs-safari-ios11": require("../../pasting/googledocs-safari-ios11.json"),
  "googledocs-safari11-macos1013": require("../../pasting/googledocs-safari11-macos1013.json"),
  "word-safari-ios11": require("../../pasting/word-safari-ios11.json"),
  "word2010-chrome62-win81": require("../../pasting/word2010-chrome62-win81.json"),
  "word2010-firefox57-win81": require("../../pasting/word2010-firefox57-win81.json"),
  "word2010-ie11-noequation-strippastedstyles-win81": require("../../pasting/word2010-ie11-noequation-strippastedstyles-win81.json"),
  "word2010-ie11-noequation-win81": require("../../pasting/word2010-ie11-noequation-win81.json"),
  "wordonline-chrome62-macos1013": require("../../pasting/wordonline-chrome62-macos1013.json"),
  "wordonline-chrome62-win81": require("../../pasting/wordonline-chrome62-win81.json"),
  "wordonline-edge16-win10": require("../../pasting/wordonline-edge16-win10.json"),
  "wordonline-firefox57-macos1013": require("../../pasting/wordonline-firefox57-macos1013.json"),
  "wordonline-firefox57-win81": require("../../pasting/wordonline-firefox57-win81.json"),
  "wordonline-ie11-win81": require("../../pasting/wordonline-ie11-win81.json"),
  "wordonline-safari11-macos1013": require("../../pasting/wordonline-safari11-macos1013.json"),
}

const FILTERS = {
  maxListNesting: 4,
  enableHorizontalRule: true,
  enableLineBreak: true,
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
}

describe("Copy-paste samples", () => {
  it("word2010-chrome62-win81", () => {
    const raw = data["word2010-chrome62-win81"]
    const content = convertFromRaw(raw)
    const editorState = filterEditorState(
      Object.assign(
        {
          editorState: EditorState.createWithContent(content),
        },
        FILTERS,
      ),
    )

    const filtered = convertToRaw(editorState.getCurrentContent())

    // We snapshot the difference in the content before-after filtering, instead of the resulting content.
    // This makes it easier to review what exactly is filtered out.
    expect(snapshotDiff(raw, filtered)).toMatchSnapshot()
  })
})
