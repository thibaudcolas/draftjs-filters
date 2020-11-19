// @flow
import React, { Component } from "react"
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
  AtomicBlockUtils,
  convertFromRaw,
  getDefaultKeyBinding,
} from "draft-js"
import type { ContentBlock } from "draft-js"
import type { DraftEntityType } from "draft-js/lib/DraftEntityType.js.flow"

import { filterEditorState } from "../../lib/index"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"
import Link, { linkStrategy } from "./Link"
import Image from "./Image"

import "./FilterableEditor.css"

const BLOCKS = {
  unstyled: "P",
  "unordered-list-item": "UL",
  "header-one": "H1",
  "header-two": "H2",
  "header-three": "H3",
}

const BLOCKS_EXTENDED = {
  unstyled: "P",
  "unordered-list-item": "UL",
  "ordered-list-item": "OL",
  "header-one": "H1",
  "header-two": "H2",
  "header-three": "H3",
  "header-four": "H4",
  "header-five": "H5",
  "header-six": "H6",
  blockquote: "❝",
  "code-block": "{ }",
}

const STYLES = {
  BOLD: "B",
  ITALIC: "I",
}

const STYLES_EXTENDED = {
  BOLD: "B",
  ITALIC: "I",
  CODE: "`",
  STRIKETHROUGH: "~",
  UNDERLINE: "_",
}

const ENTITIES = [
  {
    type: "LINK",
    label: "🔗",
    attributes: ["url"],
    whitelist: {
      href: "^(http:|https:|undefined$)",
    },
  },
  {
    type: "IMAGE",
    label: "📷",
    attributes: ["src"],
    whitelist: {
      src: "^http|\\./",
    },
  },
]

const MAX_NESTING = 1

const MAX_NESTING_EXTENDED = 4

type Props = {
  filtered: boolean,
  extended: boolean,
}

type State = {
  editorState: EditorState,
}

/**
 * Demo editor, which can be configured to filter content on paste.
 */
class FilterableEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const { extended } = props

    const decorator = new CompositeDecorator([
      {
        strategy: linkStrategy,
        component: Link,
      },
    ])

    const save = window.sessionStorage.getItem("extended")
    let editorState

    if (extended && save) {
      const content = convertFromRaw(JSON.parse(save))
      // $FlowFixMe
      editorState = EditorState.createWithContent(content, decorator)
    } else {
      // $FlowFixMe
      editorState = EditorState.createEmpty(decorator)
    }

    this.state = {
      editorState: editorState,
    }
    this.onChange = this.onChange.bind(this)
    this.keyBindingFn = this.keyBindingFn.bind(this)
    this.toggleStyle = this.toggleStyle.bind(this)
    this.toggleBlock = this.toggleBlock.bind(this)
    this.toggleEntity = this.toggleEntity.bind(this)
    this.blockRenderer = this.blockRenderer.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
  }

  /* :: onChange: (nextState: EditorState) => void; */
  onChange(nextState: EditorState) {
    const { filtered, extended } = this.props
    const { editorState } = this.state
    let filteredState = nextState

    if (filtered) {
      const shouldFilterPaste =
        nextState.getCurrentContent() !== editorState.getCurrentContent() &&
        filteredState.getLastChangeType() === "insert-fragment"

      if (shouldFilterPaste) {
        const filters = {
          blocks: Object.keys(extended ? BLOCKS_EXTENDED : BLOCKS),
          styles: Object.keys(extended ? STYLES_EXTENDED : STYLES),
          entities: ENTITIES,
          maxNesting: extended ? MAX_NESTING_EXTENDED : MAX_NESTING,
          whitespacedCharacters: ["\n", "\t", "📷"],
        }

        filteredState = filterEditorState(filters, filteredState)
      }
    }

    this.setState({ editorState: filteredState })

    window.sessionStorage.setItem(
      `content`,
      JSON.stringify(convertToRaw(nextState.getCurrentContent())),
    )
  }

  /* :: toggleStyle: (type: string, e: Event) => void; */
  toggleStyle(type: string, e: Event) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleInlineStyle(editorState, type))

    e.preventDefault()
  }

  /* :: toggleBlock: (type: string, e: Event) => void; */
  toggleBlock(type: string, e: Event) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleBlockType(editorState, type))

    e.preventDefault()
  }

  /* :: toggleEntity: (type: DraftEntityType) => void; */
  toggleEntity(type: DraftEntityType) {
    const { editorState } = this.state
    let content = editorState.getCurrentContent()

    if (type === "IMAGE") {
      content = content.createEntity(type, "IMMUTABLE", {
        src: "./word-toolbars-overload.jpg",
      })
      const entityKey = content.getLastCreatedEntityKey()
      this.onChange(
        AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, " "),
      )
    } else {
      content = content.createEntity(type, "MUTABLE", {
        url: "http://www.example.com/",
      })
      const entityKey = content.getLastCreatedEntityKey()
      const selection = editorState.getSelection()
      this.onChange(RichUtils.toggleLink(editorState, selection, entityKey))
    }
  }

  /* :: blockRenderer: (block: ContentBlock) => { component: typeof Component, editable: boolean }; */
  blockRenderer(block: ContentBlock) {
    if (block.getType() !== "atomic") {
      return null
    }

    return {
      component: Image,
      editable: false,
    }
  }

  /* :: keyBindingFn: (event: SyntheticKeyboardEvent<>) => void; */
  keyBindingFn(event: SyntheticKeyboardEvent /*:: <> */) {
    const TAB = 9
    switch (event.keyCode) {
      case TAB: {
        const { extended } = this.props
        const { editorState } = this.state
        const maxNesting = extended ? MAX_NESTING_EXTENDED : MAX_NESTING
        const newState = RichUtils.onTab(event, editorState, maxNesting)
        this.onChange(newState)
        return null
      }
      default: {
        return getDefaultKeyBinding(event)
      }
    }
  }

  /* :: handleKeyCommand: (command: string) => "handled" | "not-handled"; */
  handleKeyCommand(command: string) {
    const { editorState } = this.state

    let newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      this.onChange(newState)
      return "handled"
    }

    return "not-handled"
  }

  render() {
    const { extended } = this.props
    const { editorState } = this.state
    const styles = extended ? STYLES_EXTENDED : STYLES
    const blocks = extended ? BLOCKS_EXTENDED : BLOCKS

    return (
      <div className="FilterableEditor">
        <SentryBoundary>
          <div className="EditorToolbar">
            {Object.keys(styles).map((type) => (
              <button
                key={type}
                onMouseDown={this.toggleStyle.bind(this, type)}
              >
                {STYLES_EXTENDED[type]}
              </button>
            ))}
            {Object.keys(blocks).map((type) => (
              <button
                key={type}
                onMouseDown={this.toggleBlock.bind(this, type)}
              >
                {BLOCKS_EXTENDED[type]}
              </button>
            ))}
            {ENTITIES.map((type) => (
              <button
                key={type.type}
                onMouseDown={this.toggleEntity.bind(this, type.type)}
              >
                {type.label}
              </button>
            ))}
          </div>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            stripPastedStyles={false}
            blockRendererFn={this.blockRenderer}
            keyBindingFn={this.keyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
          />
        </SentryBoundary>
        <details>
          <summary>
            <span className="link">Debug</span>
          </summary>
          <Highlight
            language="js"
            value={JSON.stringify(
              convertToRaw(editorState.getCurrentContent()),
              null,
              2,
            )}
          />
        </details>
      </div>
    )
  }
}

export default FilterableEditor
