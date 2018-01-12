describe("demo", () => {
  it("mount", () => {
    document.body.innerHTML = "<div id=root></div>"
    require("./index")
    expect(document.body.innerHTML).toContain("DraftEditor-root")
  })

  it("no mount", () => {
    document.body.innerHTML = ""
    require("./index")
    expect(document.body.innerHTML).toBe("")
  })
})
