import { useEffect, useState } from "react"

import Highlight from "./Highlight"

const ClipboardLogger = () => {
  const [target, setValue] = useState<string>("")
  const [log, setLog] = useState<{ text: string; html: string }[]>([])
  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => setValue(e.target.value)

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const text = e.clipboardData ? e.clipboardData.getData("text/plain") : ""
      const html = e.clipboardData ? e.clipboardData.getData("text/html") : ""
      setLog(log.concat([{ text, html }]))
    }
    document.addEventListener("paste", onPaste)

    return () => {
      document.removeEventListener("paste", onPaste)
    }
  })
  return (
    <div>
      <label>
        <div>Paste here</div>
        <textarea value={target} onChange={onChange}></textarea>
      </label>
      <label>
        <div>Or here</div>
        <input type="text" value={target} onChange={onChange} />
      </label>
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
