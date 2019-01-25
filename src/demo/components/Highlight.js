// @flow
import React from "react"

type Props = {
  value: string,
  language: string,
}

const onCopy = (value) => {
  const hidden = document.createElement("textarea")
  hidden.value = value
  // $FlowFixMe
  document.body.appendChild(hidden)
  hidden.select()
  document.execCommand("copy")
  // $FlowFixMe
  document.body.removeChild(hidden)
}

const Highlight = ({ value, language }: Props) => (
  <pre className={`language-${language}`} style={{ position: "relative" }}>
    <button
      onClick={onCopy.bind(null, value)}
      style={{ position: "absolute", right: "1rem" }}
    >
      Copy
    </button>
    <code>{value}</code>
  </pre>
)

export default Highlight
