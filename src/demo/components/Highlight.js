// @flow
import React from "react"

type Props = {
  value: string,
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

const Highlight = ({ value }: Props) => (
  <div style={{ position: "relative" }}>
    <button
      onClick={onCopy.bind(null, value)}
      style={{ position: "absolute", right: "1rem" }}
    >
      Copy
    </button>
    <textarea
      style={{ width: "100%", resize: "vertical", minHeight: "100px" }}
      readOnly
      value={value}
    ></textarea>
  </div>
)

export default Highlight
