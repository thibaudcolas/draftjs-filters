import ReactDOM from "react-dom"
import "normalize.css"

import "./demo/utils/elements.css"
import "./demo/utils/typography.css"
import "./demo/utils/layout.css"
import "./demo/utils/objects.css"

import "draft-js/dist/Draft.css"

import "./demo/components/header.css"
import "./demo/components/page-nav.css"
import "./demo/utils/utilities.css"

import App from "./demo/components/App"

const mount = document.getElementById("root")

if (mount) {
  ReactDOM.render(<App />, mount)
}
