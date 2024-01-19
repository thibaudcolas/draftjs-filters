import { describe, it } from "vitest"
import { testFilteringDiff } from "./utils"
import { dropboxPaper } from "./fixtures"

describe("Dropbox Paper", () => {
  Object.entries(dropboxPaper).forEach(([key, data]) => {
    it(key, () => testFilteringDiff(data))
  })
})
