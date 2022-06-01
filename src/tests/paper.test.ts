import { testFilteringDiff } from "./utils"
import { dropboxPaper } from "./fixtures"

describe("Dropbox Paper", () => {
  Object.keys(dropboxPaper).forEach((key) => {
    it(key, () => testFilteringDiff(dropboxPaper[key]))
  })
})
