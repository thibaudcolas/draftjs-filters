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

describe("FilterableEditor", () => {
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
    expect(getByRole("toolbar")).toMatchInlineSnapshot(`
      <div
        class="EditorToolbar"
        role="toolbar"
      >
        <button>
          B
        </button>
        <button>
          I
        </button>
        <button>
          P
        </button>
        <button>
          UL
        </button>
        <button>
          H1
        </button>
        <button>
          H2
        </button>
        <button>
          H3
        </button>
        <button>
          🔗
        </button>
        <button>
          📷
        </button>
      </div>
    `)
  })

  describe("#extended", () => {
    it("works", () => {
      const { getAllByRole } = render(
        <FilterableEditor filtered={false} extended={false} />,
      )
      expect(getAllByRole("toolbar")[0]).toMatchInlineSnapshot(`
        <div
          class="EditorToolbar"
          role="toolbar"
        >
          <button>
            B
          </button>
          <button>
            I
          </button>
          <button>
            P
          </button>
          <button>
            UL
          </button>
          <button>
            H1
          </button>
          <button>
            H2
          </button>
          <button>
            H3
          </button>
          <button>
            🔗
          </button>
          <button>
            📷
          </button>
        </div>
      `)
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

      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered={false} extended ref={ref} />)

      expect(
        ref.current?.state.editorState
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
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

      ref.current?.onChange(state)

      expect(ref.current?.state.editorState).toBe(state)
    })

    it("#filtered", () => {
      const state = EditorState.createEmpty()
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered extended={false} ref={ref} />)

      ref.current?.onChange(state)

      expect(ref.current?.state.editorState).toBe(state)
    })

    it("#filtered shouldFilterPaste", () => {
      const spy = vi.spyOn(editor, "filterEditorState")
      spy.mockImplementation((_, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered extended={false} ref={ref} />)

      ref.current?.onChange(fakeState as EditorState)

      expect(editor.filterEditorState).toHaveBeenCalled()
    })

    it("#filtered shouldFilterPaste #extended", () => {
      vi.spyOn(editor, "filterEditorState").mockImplementation((_, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered extended ref={ref} />)

      ref.current?.onChange(fakeState as EditorState)

      expect(editor.filterEditorState).toHaveBeenCalled()
    })
  })

  it("toggleStyle", () => {
    const ref = React.createRef<FilterableEditor>()
    render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

    ref.current?.toggleStyle("BOLD", {
      preventDefault: () => {},
    } as React.MouseEvent)

    expect(RichUtils.toggleInlineStyle).toHaveBeenCalled()
  })

  it("toggleBlock", () => {
    const ref = React.createRef<FilterableEditor>()
    render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

    ref.current?.toggleBlock("header-two", {
      preventDefault: () => {},
    } as React.MouseEvent)

    expect(RichUtils.toggleBlockType).toHaveBeenCalled()
  })

  it("toggleEntity - LINK", () => {
    const ref = React.createRef<FilterableEditor>()
    render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

    ref.current?.toggleEntity("LINK")

    expect(RichUtils.toggleLink).toHaveBeenCalled()
  })

  it("toggleEntity - IMAGE", () => {
    const ref = React.createRef<FilterableEditor>()
    render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

    ref.current?.toggleEntity("IMAGE")

    expect(AtomicBlockUtils.insertAtomicBlock).toHaveBeenCalled()
  })

  it("blockRenderer", () => {
    const ref = React.createRef<FilterableEditor>()
    render(<FilterableEditor filtered={false} extended={false} ref={ref} />)
    expect(
      ref.current?.blockRenderer({
        getType: () => "atomic",
      } as ContentBlock),
    ).toMatchObject({
      editable: false,
    })
  })

  describe("keyBindingFn", () => {
    it("works", () => {
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

      ref.current!.onChange = vi.fn()
      ref.current?.keyBindingFn({ keyCode: 9 } as React.KeyboardEvent)
      expect(ref.current?.onChange).toHaveBeenCalled()
    })

    it("works #extended", () => {
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered={false} extended={true} ref={ref} />)

      ref.current!.onChange = vi.fn()
      ref.current?.keyBindingFn({ keyCode: 9 } as React.KeyboardEvent)
      expect(ref.current?.onChange).toHaveBeenCalled()
    })

    it("does not change state directly with other keys", () => {
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered={false} extended={false} ref={ref} />)

      ref.current!.onChange = vi.fn()
      ref.current?.keyBindingFn({ keyCode: 22 } as React.KeyboardEvent)
      expect(ref.current?.onChange).not.toHaveBeenCalled()
    })
  })

  describe("handleKeyCommand", () => {
    it("draftjs internal, handled", () => {
      handleKeyCommand.mockImplementation(
        (editorState: EditorState) => editorState,
      )
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor ref={ref} />)

      expect(ref.current?.handleKeyCommand("backspace")).toBe("handled")

      handleKeyCommand.mockRestore()
    })

    it("draftjs internal, not handled", () => {
      handleKeyCommand.mockImplementation(() => false)
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor ref={ref} />)

      expect(ref.current?.handleKeyCommand("backspace")).toBe("not-handled")

      handleKeyCommand.mockRestore()
    })
  })
})
