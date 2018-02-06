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
      shallow(<FilterableEditor filtered={false} extended={false} />).find(
        ".EditorToolbar",
      ),
    ).toMatchSnapshot()
  })

  describe("#extended", () => {
    it("works", () => {
      expect(
        shallow(<FilterableEditor filtered={false} extended />).find(
          ".EditorToolbar",
        ),
      ).toMatchSnapshot()
    })

    it("save feature", () => {
      global.sessionStorage.getItem.mockReturnValue(
        JSON.stringify({
          entityMap: {},
          blocks: [
            {
              key: "a",
              text: "test",
            },
          ],
        }),
      )

      expect(
        shallow(<FilterableEditor filtered={false} extended />)
          .state("editorState")
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b.getText())
          .toJS(),
      ).toEqual({
        a: "test",
      })
    })
  })

  describe("onChange", () => {
    it("works", () => {
      const state = EditorState.createEmpty()
      const wrapper = shallow(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered", () => {
      const state = EditorState.createEmpty()
      const wrapper = shallow(<FilterableEditor filtered extended={false} />)

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
      const wrapper = shallow(<FilterableEditor filtered extended={false} />)

      wrapper.instance().onChange(fakeState)

      expect(lib.filterEditorState).toHaveBeenCalled()
    })

    it("#filtered shouldFilterPaste #extended", () => {
      jest.spyOn(lib, "filterEditorState")
      lib.filterEditorState.mockImplementation((opts, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const wrapper = shallow(<FilterableEditor filtered extended />)

      wrapper.instance().onChange(fakeState)

      expect(lib.filterEditorState).toHaveBeenCalled()
    })
  })

  it("toggleStyle", () => {
    shallow(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleStyle("BOLD", new Event("mousedown"))

    expect(RichUtils.toggleInlineStyle).toHaveBeenCalled()
  })

  it("toggleBlock", () => {
    shallow(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleBlock("header-two", new Event("mousedown"))

    expect(RichUtils.toggleBlockType).toHaveBeenCalled()
  })

  it("toggleEntity - LINK", () => {
    shallow(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleEntity("LINK")

    expect(RichUtils.toggleLink).toHaveBeenCalled()
  })

  it("toggleEntity - IMAGE", () => {
    shallow(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleEntity("IMAGE")

    expect(AtomicBlockUtils.insertAtomicBlock).toHaveBeenCalled()
  })

  it("blockRenderer", () => {
    expect(
      shallow(<FilterableEditor filtered={false} extended={false} />)
        .instance()
        .blockRenderer({
          getType: () => "atomic",
        }),
    ).toMatchObject({
      editable: false,
    })
  })

  describe("onTab", () => {
    it("works", () => {
      const wrapper = shallow(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange = jest.fn()
      wrapper.instance().onTab({})
      expect(wrapper.instance().onChange).toHaveBeenCalled()
    })

    it("#extended", () => {
      const wrapper = shallow(<FilterableEditor filtered={false} extended />)

      wrapper.instance().onChange = jest.fn()
      wrapper.instance().onTab({})
      expect(wrapper.instance().onChange).toHaveBeenCalled()
    })
  })
})
