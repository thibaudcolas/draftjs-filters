import { testFilteringDiff } from "./utils"
import { wordOnline } from "./fixtures"

describe("Word Online", () => {
  Object.keys(wordOnline).forEach((key) => {
    it(key, () => testFilteringDiff(wordOnline[key]))
  })
})
