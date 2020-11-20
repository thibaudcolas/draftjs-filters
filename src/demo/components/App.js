// @flow
import React, { Component } from "react"
import "./App.css"

import FilterableEditor from "./FilterableEditor"
import ClipboardLogger from "./ClipboardLogger"

class App extends Component<{}> {
  render() {
    return (
      <div className="App">
        <h2>With filtering</h2>
        <p>
          Rich text pasted into this editor is filtered, keeping only the
          formats available in the toolbar. Try it out with any of these
          documents:
        </p>
        <ul className="list-inline">
          <li>
            <a
              className="link"
              href="https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Docs
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://paper.dropbox.com/doc/Draft.js-paste-test-document-njfdkwmkeGQ9KICjVwLmU"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dropbox Paper
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://1drv.ms/w/s!AuGin45FpiF5hjzm9QdWHYGqPrqm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Word Online
            </a>
          </li>
        </ul>

        <FilterableEditor filtered={true} extended={false} />
        <h2>Without filtering</h2>

        <p>
          All of the formatting preserved by Draft.js is preserved in the
          editor.
        </p>

        <FilterableEditor filtered={false} extended={false} />

        <h2>Going further</h2>
        <p>
          By default, Draft.js preserves quite a lot. Have a look at our&nbsp;
          <a
            className="link"
            href="https://github.com/thibaudcolas/draftjs-filters/tree/main/pasting"
          >
            full test suite
          </a>
          , and if there is anything that is missing please&nbsp;
          <a
            className="link"
            href="https://github.com/thibaudcolas/draftjs-filters/issues"
          >
            open an issue on GitHub
          </a>
          .
        </p>
        <p>
          Here are more ready-made rich text paste testing documents should you
          need them:
        </p>
        <ul className="list-inline">
          <li>
            <a
              className="link"
              href="https://github.com/thibaudcolas/draftjs-filters/blob/main/pasting/documents/Draft.js%20paste%20test%20document%20Word2010.docx"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Word 2010
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Docs
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://paper.dropbox.com/doc/Draft.js-paste-test-document-njfdkwmkeGQ9KICjVwLmU"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dropbox Paper
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://github.com/thibaudcolas/draftjs-filters/blob/main/pasting/documents/Draft.js%20paste%20test%20document.pages"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Pages
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://github.com/thibaudcolas/draftjs-filters/blob/main/pasting/documents/Draft.js%20paste%20test%20document%20Word2016%20macOS.docx"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Word 2016 macOS
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://1drv.ms/w/s!AuGin45FpiF5hjzm9QdWHYGqPrqm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Word Online
            </a>
          </li>
          <li>
            <a
              className="link"
              href="tests"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTML content
            </a>
          </li>
        </ul>

        <p>Here is an editor with more formatting enabled:</p>

        <FilterableEditor filtered={false} extended={true} />

        <h3>Clipboard log</h3>

        <ClipboardLogger />
      </div>
    )
  }
}

export default App
