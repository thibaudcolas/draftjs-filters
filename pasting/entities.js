/* eslint-disable    */
/* eslint-disable global-require */
const data = {
  "applepages-chrome62-macos1013": require("./json/applepages-chrome62-macos1013.json"),
  "applepages-firefox57-macos1013": require("./json/applepages-firefox57-macos1013.json"),
  "applepages-safari-ios11": require("./json/applepages-safari-ios11.json"),
  "applepages-safari11-macos1013": require("./json/applepages-safari11-macos1013.json"),
  "dropboxpaper-chrome62-macos1013": require("./json/dropboxpaper-chrome62-macos1013.json"),
  "dropboxpaper-chrome62-win81": require("./json/dropboxpaper-chrome62-win81.json"),
  "dropboxpaper-edge16-win10": require("./json/dropboxpaper-edge16-win10.json"),
  "dropboxpaper-firefox57-macos1013": require("./json/dropboxpaper-firefox57-macos1013.json"),
  "dropboxpaper-firefox57-win81": require("./json/dropboxpaper-firefox57-win81.json"),
  "dropboxpaper-ie11-unsupported-strippastedstyles-win81": require("./json/dropboxpaper-ie11-unsupported-strippastedstyles-win81.json"),
  "dropboxpaper-ie11-unsupported-win81": require("./json/dropboxpaper-ie11-unsupported-win81.json"),
  "dropboxpaper-safari-ios11": require("./json/dropboxpaper-safari-ios11.json"),
  "dropboxpaper-safari11-macos1013": require("./json/dropboxpaper-safari11-macos1013.json"),
  "googledocs-chrome62-macos1013": require("./json/googledocs-chrome62-macos1013.json"),
  "googledocs-chrome62-win81": require("./json/googledocs-chrome62-win81.json"),
  "googledocs-edge16-win10": require("./json/googledocs-edge16-win10.json"),
  "googledocs-firefox57-macos1013": require("./json/googledocs-firefox57-macos1013.json"),
  "googledocs-firefox57-win81": require("./json/googledocs-firefox57-win81.json"),
  "googledocs-ie11-strippastedstyles-win81": require("./json/googledocs-ie11-strippastedstyles-win81.json"),
  "googledocs-ie11-win81": require("./json/googledocs-ie11-win81.json"),
  "googledocs-safari-ios11": require("./json/googledocs-safari-ios11.json"),
  "googledocs-safari11-macos1013": require("./json/googledocs-safari11-macos1013.json"),
  "word-safari-ios11": require("./json/word-safari-ios11.json"),
  "word2010-chrome62-win81": require("./json/word2010-chrome62-win81.json"),
  "word2010-firefox57-win81": require("./json/word2010-firefox57-win81.json"),
  "word2010-ie11-noequation-strippastedstyles-win81": require("./json/word2010-ie11-noequation-strippastedstyles-win81.json"),
  "word2010-ie11-noequation-win81": require("./json/word2010-ie11-noequation-win81.json"),
  "wordonline-chrome62-macos1013": require("./json/wordonline-chrome62-macos1013.json"),
  "wordonline-chrome62-win81": require("./json/wordonline-chrome62-win81.json"),
  "wordonline-edge16-win10": require("./json/wordonline-edge16-win10.json"),
  "wordonline-firefox57-macos1013": require("./json/wordonline-firefox57-macos1013.json"),
  "wordonline-firefox57-win81": require("./json/wordonline-firefox57-win81.json"),
  "wordonline-safari11-macos1013": require("./json/wordonline-safari11-macos1013.json"),
}

const labels = {
  applepages: "Apple Pages",
  chrome62: "Chrome 62",
  dropboxpaper: "Dropbox Paper",
  edge16: "Edge 16",
  firefox57: "Firefox 57",
  googledocs: "Google Docs",
  ie11: "IE11",
  ios11: "iOS 11",
  macos1013: "macOS 10.13",
  noequation: "No equation",
  safari: "Safari",
  safari11: "Safari 11",
  strippastedstyles: "stripPastedStyles",
  unsupported: "Unsupported",
  win10: "Windows 10",
  win81: "Windows 8.1",
  word: "Word",
  word2010: "Word 2010",
  wordonline: "Word Online",
}

const attributes = {
  IMAGE: {},
  LINK: {},
}

Object.keys(data).forEach((key) => {
  const contentState = Object.assign(
    {
      entityMap: {},
      blocks: [],
    },
    data[key],
  )
  const qualifiers = key.split("-").map((q) => labels[q])
  const [editor, browser] = qualifiers
  // console.log(editor, browser);
  Object.values(contentState.entityMap).forEach((e) => {
    Object.keys(e.data).forEach((attr) => {
      if (!attributes[e.type][attr]) {
        attributes[e.type][attr] = []
      }

      attributes[e.type][attr].push(e.data[attr])
    })
  })
})

console.log(attributes)
