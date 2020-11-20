// @flow
import React, { useEffect, useState } from "react"
import Highlight from "./Highlight"

const ClipboardLogger = () => {
  const [log, setLog] = useState([])
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const text = e.clipboardData.getData("text/plain")
        const html = e.clipboardData.getData("text/html")
        setLog(
          log.concat([
            {
              text,
              html,
            },
          ]),
        )
      }
    }
    document.addEventListener("paste", onPaste)

    return () => {
      document.removeEventListener("paste", onPaste)
    }
  })
  return (
    <div>
      {log.map(({ text, html }, i) => {
        return (
          <div key={i}>
            <p>{`${i}: ${text.slice(0, 50)}…`}</p>
            <Highlight value={html}></Highlight>
          </div>
        )
      })}
    </div>
  )
}

export default ClipboardLogger
