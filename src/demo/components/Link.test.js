import React from "react"
import { shallow } from "enzyme"
import { EditorState, ContentState, convertFromHTML } from "draft-js"

import Link, { linkStrategy } from "./Link"

describe("Link", () => {
  it("renders", () => {
    expect(shallow(<Link>Test</Link>)).toMatchSnapshot()
  })
})

describe("linkStrategy", () => {
  it("works", () => {
    const editorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(`<h1><a href="http://example.com/">Test</a></h1>`),
      ),
    )
    const currentContent = editorState.getCurrentContent()
    const callback = jest.fn()
    linkStrategy(currentContent.getFirstBlock(), callback, currentContent)
    expect(callback).toHaveBeenCalled()
  })
})
