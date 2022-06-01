import { testFilteringDiff } from "./utils"
import { googleDocs } from "./fixtures"

describe("Google Docs", () => {
  Object.keys(googleDocs).forEach((key) => {
    it(key, () => testFilteringDiff(googleDocs[key]))
  })
})
