import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import { createSerializer } from "enzyme-to-json"

configure({ adapter: new Adapter() })

expect.addSnapshotSerializer(createSerializer({ mode: "deep" }))

jest.mock("draft-js", () => {
  const packages = {
    "0.10": "draft-js-10",
    0.11: "draft-js",
  }
  const version = process.env.DRAFTJS_VERSION || "0.11"

  // Require the original module.
  const originalModule = jest.requireActual(packages[version])

  return {
    __esModule: true,
    ...originalModule,
  }
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
