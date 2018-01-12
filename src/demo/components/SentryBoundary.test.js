import React from "react"
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

  it("componentDidCatch Raven", () => {
    window.Raven = {
      captureException: jest.fn(),
    }
    const wrapper = shallow(<SentryBoundary>Test</SentryBoundary>)

    wrapper.instance().componentDidCatch(new Error("test"), {
      info: "test",
    })

    expect(window.Raven.captureException).toHaveBeenCalled()
  })

  it("#error", () => {
    window.Raven = false
    expect(
      shallow(<SentryBoundary>Test</SentryBoundary>).setState({
        error: new Error("test"),
      }),
    ).toMatchSnapshot()
  })

  it("#error reload", () => {
    window.Raven = false
    window.location.reload = jest.fn()

    shallow(<SentryBoundary>Test</SentryBoundary>)
      .setState({
        error: new Error("test"),
      })
      .find("button")
      .simulate("click")
    expect(window.location.reload).toHaveBeenCalled()
  })

  it("#error Raven", () => {
    window.Raven = true
    expect(
      shallow(<SentryBoundary>Test</SentryBoundary>).setState({
        error: new Error("test"),
      }),
    ).toMatchSnapshot()
  })

  it("#error Raven report", () => {
    window.Raven = {
      lastEventId: jest.fn(() => true),
      showReportDialog: jest.fn(),
    }
    window.location.reload = jest.fn()

    shallow(<SentryBoundary>Test</SentryBoundary>)
      .setState({
        error: new Error("test"),
      })
      .find("button")
      .at(0)
      .simulate("click")
    expect(window.Raven.lastEventId).toHaveBeenCalled()
  })
})
