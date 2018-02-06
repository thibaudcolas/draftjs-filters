import React from "react"
import { shallow } from "enzyme"
import { EditorState, RichUtils, AtomicBlockUtils } from "draft-js"

import FilterableEditor from "./FilterableEditor"

const lib = require("../../lib/index")

describe("FilterableEditor", () => {
  beforeEach(() => {
    global.sessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    }
    jest.spyOn(RichUtils, "toggleInlineStyle")
    jest.spyOn(RichUtils, "toggleBlockType")
    jest.spyOn(RichUtils, "toggleLink")
    jest.spyOn(AtomicBlockUtils, "insertAtomicBlock")
  })

  afterEach(() => {
    RichUtils.toggleInlineStyle.mockRestore()
    RichUtils.toggleBlockType.mockRestore()
    RichUtils.toggleLink.mockRestore()
    AtomicBlockUtils.insertAtomicBlock.mockRestore()
  })

  it("renders", () => {
    // Do not snapshot the Draft.js editor, as it contains unstable keys in the content.
    expect(
      shallow(<FilterableEditor filtered={false} />).find(".EditorToolbar"),
    ).toMatchSnapshot()
  })

  describe("onChange", () => {
    it("works", () => {
      const state = EditorState.createEmpty()
      const wrapper = shallow(<FilterableEditor filtered={false} />)

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered", () => {
      const state = EditorState.createEmpty()
      const wrapper = shallow(<FilterableEditor filtered />)

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered shouldFilterPaste", () => {
      jest.spyOn(lib, "filterEditorState")
      lib.filterEditorState.mockImplementation((opts, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const wrapper = shallow(<FilterableEditor filtered />)

      wrapper.instance().onChange(fakeState)

      expect(lib.filterEditorState).toHaveBeenCalled()
    })
  })

  it("toggleStyle", () => {
    shallow(<FilterableEditor filtered={false} />)
      .instance()
      .toggleStyle("BOLD", new Event("mousedown"))

    expect(RichUtils.toggleInlineStyle).toHaveBeenCalled()
  })

  it("toggleBlock", () => {
    shallow(<FilterableEditor filtered={false} />)
      .instance()
      .toggleBlock("header-two", new Event("mousedown"))

    expect(RichUtils.toggleBlockType).toHaveBeenCalled()
  })

  it("toggleEntity - LINK", () => {
    shallow(<FilterableEditor filtered={false} />)
      .instance()
      .toggleEntity("LINK")

    expect(RichUtils.toggleLink).toHaveBeenCalled()
  })

  it("toggleEntity - IMAGE", () => {
    shallow(<FilterableEditor filtered={false} />)
      .instance()
      .toggleEntity("IMAGE")

    expect(AtomicBlockUtils.insertAtomicBlock).toHaveBeenCalled()
  })

  it("blockRenderer", () => {
    expect(
      shallow(<FilterableEditor filtered={false} />)
        .instance()
        .blockRenderer({
          getType: () => "atomic",
        }),
    ).toMatchObject({
      editable: false,
    })
  })
})
