// @flow
import React from "react"
import ReactDOM from "react-dom"

import "prismjs/themes/prism.css"
import "draft-js/dist/Draft.css"

import "./index.css"

import App from "./App"

const mount = document.getElementById("root")

if (mount) {
  ReactDOM.render(<App />, mount)
}
