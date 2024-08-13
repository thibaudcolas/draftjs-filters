import { expect, vi } from "vitest"

// https://github.com/jest-community/snapshot-diff
const SNAPSHOT_TITLE = "Snapshot Diff:\n"

expect.addSnapshotSerializer({
  test(value) {
    return typeof value === "string" && value.indexOf(SNAPSHOT_TITLE) === 0
  },
  print(value) {
    return value
  },
})

vi.mock("draft-js", async () => {
  const packages = {
    "0.10": "draft-js-10",
    0.11: "draft-js",
  }
  const version = process.env.DRAFTJS_VERSION || "0.11"

  return await vi.importActual(packages[version])
})

const consoleWarn = console.warn

console.warn = function filterWarnings(msg, ...args) {
  // Stop logging React warnings we shouldn’t be doing anything about at this time.
  const supressedWarnings = [
    "Warning: componentWillMount",
    "Warning: componentWillReceiveProps",
    "Warning: componentWillUpdate",
  ]

  if (!supressedWarnings.some((entry) => msg.includes(entry))) {
    consoleWarn.apply(console, ...args)
  }
}
