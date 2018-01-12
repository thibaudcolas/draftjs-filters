import React from "react"
import { shallow } from "enzyme"
import Highlight from "./Highlight"

describe("Highlight", () => {
  it("renders", () => {
    expect(
      shallow(<Highlight value="" language="javascript" />),
    ).toMatchSnapshot()
  })

  it("onCopy", () => {
    document.execCommand = jest.fn()
    const wrapper = shallow(<Highlight value="" language="javascript" />)

    wrapper.find("button").simulate("click")

    expect(document.execCommand).toHaveBeenCalledWith("copy")
  })
})
