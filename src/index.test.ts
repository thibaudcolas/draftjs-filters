describe("demo", () => {
  beforeEach(() => {
    jest.resetModules()
    // global.sessionStorage = {
    //   getItem: jest.fn(),
    //   setItem: jest.fn(),
    // }
  })

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
