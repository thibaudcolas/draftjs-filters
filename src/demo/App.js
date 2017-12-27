// @flow
import React, { Component } from "react"
import "./App.css"

import TestEditor from "./TestEditor"

class App extends Component<{}> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Draft.js rich text paste test</h1>
        </header>
        <TestEditor />
      </div>
    )
  }
}

export default App
