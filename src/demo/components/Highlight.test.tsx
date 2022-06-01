import { shallow } from "enzyme"
import Highlight from "./Highlight"

describe("Highlight", () => {
  it("renders", () => {
    expect(shallow(<Highlight value="" />)).toMatchSnapshot()
  })

  it("onCopy", () => {
    document.execCommand = jest.fn()
    const wrapper = shallow(<Highlight value="" />)

    wrapper.find("button").simulate("click")

    expect(document.execCommand).toHaveBeenCalledWith("copy")
  })
})
