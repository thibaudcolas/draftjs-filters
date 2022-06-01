import { mount, shallow } from "enzyme"
import {
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  ContentBlock,
} from "draft-js"

import FilterableEditor from "./FilterableEditor"
import React from "react"

const editor = require("../../lib/filters/editor")

describe("FilterableEditor", () => {
  let getItem: jest.SpyInstance
  let toggleInlineStyle: jest.SpyInstance
  let toggleBlockType: jest.SpyInstance
  let toggleLink: jest.SpyInstance
  let handleKeyCommand: jest.SpyInstance
  let insertAtomicBlock: jest.SpyInstance

  beforeEach(() => {
    getItem = jest.spyOn(Storage.prototype, "getItem")
    toggleInlineStyle = jest.spyOn(RichUtils, "toggleInlineStyle")
    toggleBlockType = jest.spyOn(RichUtils, "toggleBlockType")
    toggleLink = jest.spyOn(RichUtils, "toggleLink")
    handleKeyCommand = jest.spyOn(RichUtils, "handleKeyCommand")
    insertAtomicBlock = jest.spyOn(AtomicBlockUtils, "insertAtomicBlock")
  })

  afterEach(() => {
    toggleInlineStyle.mockRestore()
    toggleBlockType.mockRestore()
    toggleLink.mockRestore()
    handleKeyCommand.mockRestore()
    insertAtomicBlock.mockRestore()
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
      getItem.mockReturnValue(
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
        shallow<FilterableEditor>(
          <FilterableEditor filtered={false} extended />,
        )
          .state("editorState")
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b!.getText())
          .toJS(),
      ).toEqual({
        a: "test",
      })
    })
  })

  describe("onChange", () => {
    it("works", () => {
      const state = EditorState.createEmpty()
      const wrapper = shallow<FilterableEditor>(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered", () => {
      const state = EditorState.createEmpty()
      const wrapper = shallow<FilterableEditor>(
        <FilterableEditor filtered extended={false} />,
      )

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered shouldFilterPaste", () => {
      const spy = jest.spyOn(editor, "filterEditorState")
      spy.mockImplementation((opts, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const wrapper = shallow<FilterableEditor>(
        <FilterableEditor filtered extended={false} />,
      )

      wrapper.instance().onChange(fakeState as EditorState)

      expect(editor.filterEditorState).toHaveBeenCalled()
    })

    it("#filtered shouldFilterPaste #extended", () => {
      const spy = jest.spyOn(editor, "filterEditorState")
      spy.mockImplementation((opts, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const wrapper = shallow<FilterableEditor>(
        <FilterableEditor filtered extended />,
      )

      wrapper.instance().onChange(fakeState as EditorState)

      expect(editor.filterEditorState).toHaveBeenCalled()
    })
  })

  it("toggleStyle", () => {
    shallow<FilterableEditor>(
      <FilterableEditor filtered={false} extended={false} />,
    )
      .instance()
      .toggleStyle("BOLD", { preventDefault: () => {} } as React.MouseEvent)

    expect(RichUtils.toggleInlineStyle).toHaveBeenCalled()
  })

  it("toggleBlock", () => {
    shallow<FilterableEditor>(
      <FilterableEditor filtered={false} extended={false} />,
    )
      .instance()
      .toggleBlock("header-two", {
        preventDefault: () => {},
      } as React.MouseEvent)

    expect(RichUtils.toggleBlockType).toHaveBeenCalled()
  })

  it("toggleEntity - LINK", () => {
    shallow<FilterableEditor>(
      <FilterableEditor filtered={false} extended={false} />,
    )
      .instance()
      .toggleEntity("LINK")

    expect(RichUtils.toggleLink).toHaveBeenCalled()
  })

  it("toggleEntity - IMAGE", () => {
    shallow<FilterableEditor>(
      <FilterableEditor filtered={false} extended={false} />,
    )
      .instance()
      .toggleEntity("IMAGE")

    expect(AtomicBlockUtils.insertAtomicBlock).toHaveBeenCalled()
  })

  it("blockRenderer", () => {
    expect(
      shallow<FilterableEditor>(
        <FilterableEditor filtered={false} extended={false} />,
      )
        .instance()
        .blockRenderer({
          getType: () => "atomic",
        } as ContentBlock),
    ).toMatchObject({
      editable: false,
    })
  })

  describe("keyBindingFn", () => {
    it("works", () => {
      const wrapper = mount<FilterableEditor>(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange = jest.fn()
      wrapper.instance().keyBindingFn({ keyCode: 9 } as React.KeyboardEvent)
      expect(wrapper.instance().onChange).toHaveBeenCalled()
    })

    it("works #extended", () => {
      const wrapper = mount<FilterableEditor>(
        <FilterableEditor filtered={false} extended={true} />,
      )

      wrapper.instance().onChange = jest.fn()
      wrapper.instance().keyBindingFn({ keyCode: 9 } as React.KeyboardEvent)
      expect(wrapper.instance().onChange).toHaveBeenCalled()
    })

    it("does not change state directly with other keys", () => {
      const wrapper = mount<FilterableEditor>(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange = jest.fn()
      wrapper.instance().keyBindingFn({ keyCode: 22 } as React.KeyboardEvent)
      expect(wrapper.instance().onChange).not.toHaveBeenCalled()
    })
  })

  describe("handleKeyCommand", () => {
    it("draftjs internal, handled", () => {
      handleKeyCommand.mockImplementation((editorState) => editorState)

      expect(
        shallow<FilterableEditor>(<FilterableEditor />)
          .instance()
          .handleKeyCommand("backspace"),
      ).toBe("handled")

      handleKeyCommand.mockRestore()
    })

    it("draftjs internal, not handled", () => {
      handleKeyCommand.mockImplementation(() => false)

      expect(
        shallow<FilterableEditor>(<FilterableEditor />)
          .instance()
          .handleKeyCommand("backspace"),
      ).toBe("not-handled")

      handleKeyCommand.mockRestore()
    })
  })
})
