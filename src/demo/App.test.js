import React from "react"
import { shallow } from "enzyme"
import App from "./App"

describe("App", () => {
  it("renders", () => {
    expect(shallow(<App />)).toMatchSnapshot()
  })
})
