import { testFilteringDiff } from "./utils"
import { applePages } from "./fixtures"

describe("Apple Pages", () => {
  Object.keys(applePages).forEach((key) => {
    it(key, () => testFilteringDiff(applePages[key]))
  })
})
