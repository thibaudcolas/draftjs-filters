import { testFilteringDiff } from "./utils"
import { googleDocs } from "./fixtures"

describe("Google Docs", () => {
  Object.entries(googleDocs).forEach(([key, data]) => {
    it(key, () => testFilteringDiff(data))
  })
})
