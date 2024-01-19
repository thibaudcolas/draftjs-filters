import { describe, it, beforeEach, afterEach, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import {
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  ContentBlock,
} from "draft-js"

import FilterableEditor from "./FilterableEditor"
import React from "react"

import * as editor from "../../lib/filters/editor"

describe.skip("FilterableEditor", () => {
  let getItem: any
  let toggleInlineStyle: any
  let toggleBlockType: any
  let toggleLink: any
  let handleKeyCommand: any
  let insertAtomicBlock: any

  beforeEach(() => {
    getItem = vi.spyOn(Storage.prototype, "getItem")
    toggleInlineStyle = vi.spyOn(RichUtils, "toggleInlineStyle")
    toggleBlockType = vi.spyOn(RichUtils, "toggleBlockType")
    toggleLink = vi.spyOn(RichUtils, "toggleLink")
    handleKeyCommand = vi.spyOn(RichUtils, "handleKeyCommand")
    insertAtomicBlock = vi.spyOn(AtomicBlockUtils, "insertAtomicBlock")
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
    const { getByRole } = render(
      <FilterableEditor filtered={false} extended={false} />,
    )
    expect(getByRole("toolbar")).toMatchSnapshot()
  })

  describe("#extended", () => {
    it("works", () => {
      const { getByRole } = render(
        <FilterableEditor filtered={false} extended={false} />,
      )
      expect(getByRole("toolbar")).toMatchSnapshot()
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
        render(<FilterableEditor filtered={false} extended />)
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
      const wrapper = render(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered", () => {
      const state = EditorState.createEmpty()
      const wrapper = render(<FilterableEditor filtered extended={false} />)

      wrapper.instance().onChange(state)

      expect(wrapper.state("editorState")).toBe(state)
    })

    it("#filtered shouldFilterPaste", () => {
      const spy = vi.spyOn(editor, "filterEditorState")
      spy.mockImplementation((opts, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const wrapper = render(<FilterableEditor filtered extended={false} />)

      wrapper.instance().onChange(fakeState as EditorState)

      expect(editor.filterEditorState).toHaveBeenCalled()
    })

    it("#filtered shouldFilterPaste #extended", () => {
      const spy = vi.spyOn(editor, "filterEditorState")
      spy.mockImplementation((opts, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const wrapper = render(<FilterableEditor filtered extended />)

      wrapper.instance().onChange(fakeState as EditorState)

      expect(editor.filterEditorState).toHaveBeenCalled()
    })
  })

  it("toggleStyle", () => {
    render(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleStyle("BOLD", { preventDefault: () => {} } as React.MouseEvent)

    expect(RichUtils.toggleInlineStyle).toHaveBeenCalled()
  })

  it("toggleBlock", () => {
    render(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleBlock("header-two", {
        preventDefault: () => {},
      } as React.MouseEvent)

    expect(RichUtils.toggleBlockType).toHaveBeenCalled()
  })

  it("toggleEntity - LINK", () => {
    render(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleEntity("LINK")

    expect(RichUtils.toggleLink).toHaveBeenCalled()
  })

  it("toggleEntity - IMAGE", () => {
    render(<FilterableEditor filtered={false} extended={false} />)
      .instance()
      .toggleEntity("IMAGE")

    expect(AtomicBlockUtils.insertAtomicBlock).toHaveBeenCalled()
  })

  it("blockRenderer", () => {
    expect(
      render(<FilterableEditor filtered={false} extended={false} />)
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

      wrapper.instance().onChange = vi.fn()
      wrapper.instance().keyBindingFn({ keyCode: 9 } as React.KeyboardEvent)
      expect(wrapper.instance().onChange).toHaveBeenCalled()
    })

    it("works #extended", () => {
      const wrapper = mount<FilterableEditor>(
        <FilterableEditor filtered={false} extended={true} />,
      )

      wrapper.instance().onChange = vi.fn()
      wrapper.instance().keyBindingFn({ keyCode: 9 } as React.KeyboardEvent)
      expect(wrapper.instance().onChange).toHaveBeenCalled()
    })

    it("does not change state directly with other keys", () => {
      const wrapper = mount<FilterableEditor>(
        <FilterableEditor filtered={false} extended={false} />,
      )

      wrapper.instance().onChange = vi.fn()
      wrapper.instance().keyBindingFn({ keyCode: 22 } as React.KeyboardEvent)
      expect(wrapper.instance().onChange).not.toHaveBeenCalled()
    })
  })

  describe("handleKeyCommand", () => {
    it("draftjs internal, handled", () => {
      handleKeyCommand.mockImplementation((editorState) => editorState)

      expect(
        render(<FilterableEditor />)
          .instance()
          .handleKeyCommand("backspace"),
      ).toBe("handled")

      handleKeyCommand.mockRestore()
    })

    it("draftjs internal, not handled", () => {
      handleKeyCommand.mockImplementation(() => false)

      expect(
        render(<FilterableEditor />)
          .instance()
          .handleKeyCommand("backspace"),
      ).toBe("not-handled")

      handleKeyCommand.mockRestore()
    })
  })
})
