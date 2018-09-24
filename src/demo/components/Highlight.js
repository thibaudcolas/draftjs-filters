// @flow
import React from "react"
// flowlint-next-line untyped-import:off
import Prism from "prismjs"

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
    <code
      // eslint-disable-next-line springload/react/no-danger
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(value, Prism.languages[language]),
      }}
    />
  </pre>
)

export default Highlight
