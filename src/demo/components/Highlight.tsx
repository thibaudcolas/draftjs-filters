const onCopy = (value: string) => {
  const hidden = document.createElement("textarea")
  hidden.value = value
  document.body.appendChild(hidden)
  hidden.select()
  document.execCommand("copy")
  document.body.removeChild(hidden)
}

interface HighlightProps {
  value: string
}

const Highlight = ({ value }: HighlightProps) => (
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
