import {
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
  vi,
  MockInstance,
} from "vitest"
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
  let getItem: MockInstance<typeof Storage.prototype.getItem>
  let toggleInlineStyle: MockInstance<typeof RichUtils.toggleInlineStyle>
  let toggleBlockType: MockInstance<typeof RichUtils.toggleBlockType>
  let toggleLink: MockInstance<typeof RichUtils.toggleLink>
  let handleKeyCommand: MockInstance<typeof RichUtils.handleKeyCommand>
  let insertAtomicBlock: MockInstance<typeof AtomicBlockUtils.insertAtomicBlock>

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

    it("#filtered shouldFilterPaste to avoid multiline", () => {
      vi.spyOn(editor, "condenseBlocks").mockImplementation((_, e) => e)

      const state = EditorState.createEmpty()
      const fakeState = {
        getCurrentContent: () => state.getCurrentContent(),
        getLastChangeType: () => "insert-fragment",
      }
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor filtered extended multiline={false} ref={ref} />)

      ref.current?.onChange(fakeState as EditorState)

      expect(editor.condenseBlocks).toHaveBeenCalled()
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
        // @ts-expect-error - ignore
        (editorState: EditorState) => editorState,
      )
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor ref={ref} />)

      expect(ref.current?.handleKeyCommand("backspace")).toBe("handled")

      handleKeyCommand.mockRestore()
    })

    it("draftjs internal, not handled", () => {
      handleKeyCommand.mockImplementation(() => null)
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor ref={ref} />)

      expect(ref.current?.handleKeyCommand("backspace")).toBe("not-handled")

      handleKeyCommand.mockRestore()
    })
  })

  describe("handleReturn", () => {
    it("prevents multiline", () => {
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor multiline={false} ref={ref} />)

      expect(ref.current?.handleReturn()).toBe("handled")
    })

    it("allows multiline", () => {
      const ref = React.createRef<FilterableEditor>()
      render(<FilterableEditor ref={ref} />)

      expect(ref.current?.handleReturn()).toBe("not-handled")
    })
  })
})
