import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import { createSerializer } from "enzyme-to-json"

configure({ adapter: new Adapter() })

expect.addSnapshotSerializer(createSerializer({ mode: "deep" }))

jest.mock("draft-js", () => {
  const packages = {
    "0.10": "draft-js",
    "0.11": "draft-js-11",
  }
  const version = process.env.DRAFTJS_VERSION || "0.10"

  // Require the original module.
  const originalModule = jest.requireActual(packages[version])

  return {
    __esModule: true,
    ...originalModule,
  }
})
