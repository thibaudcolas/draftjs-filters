// @flow
import React from "react"
import ReactDOM from "react-dom"

import "normalize.css"

import "./utils/elements.css"
import "./utils/typography.css"
import "./utils/layout.css"
import "./utils/objects.css"

import "prismjs/themes/prism.css"
import "draft-js/dist/Draft.css"

import "./components/header.css"
import "./components/page-nav.css"

import "./utils/utilities.css"

import App from "./components/App"

const mount = document.getElementById("root")

if (mount) {
  ReactDOM.render(<App />, mount)
}
