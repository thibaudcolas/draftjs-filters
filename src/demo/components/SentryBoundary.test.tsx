import { shallow } from "enzyme"
import SentryBoundary from "./SentryBoundary"

describe("SentryBoundary", () => {
  it("renders", () => {
    expect(shallow(<SentryBoundary>Test</SentryBoundary>)).toMatchSnapshot()
  })

  it("componentDidCatch", () => {
    const wrapper = shallow(<SentryBoundary>Test</SentryBoundary>)

    wrapper.instance().componentDidCatch(new Error("test"), {
      info: "test",
    })

    expect(wrapper.state("error")).not.toBe(null)
  })

  it("#error", () => {
    expect(
      shallow(<SentryBoundary>Test</SentryBoundary>).setState({
        error: new Error("test"),
      }),
    ).toMatchSnapshot()
  })

  it("#error reload", () => {
    delete window.location
    window.location = { reload: jest.fn() }

    shallow(<SentryBoundary>Test</SentryBoundary>)
      .setState({
        error: new Error("test"),
      })
      .find("button")
      .simulate("click")
    expect(window.location.reload).toHaveBeenCalled()
  })
})
