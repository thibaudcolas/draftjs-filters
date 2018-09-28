// @flow
// flowlint untyped-import:off
const { danger, message, warn, fail, schedule } = require("danger")

const libModifiedFiles = danger.git.modified_files.filter(
  (path) => path.startsWith("src/lib") && path.endsWith("js"),
)
const hasLibChanges =
  libModifiedFiles.filter((filepath) => !filepath.endsWith("test.js")).length >
  0
const pastingTestsChanges = danger.git.modified_files.filter((p) =>
  p.startsWith("src/tests"),
)
const hasREADMEChanges = danger.git.modified_files.includes("README.md")

// Fails if the description is too short.
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
  fail(":grey_question: This pull request needs a description.")
}

// Warns if the PR title contains [WIP]
const isWIP = danger.github.pr.title.includes("WIP")
if (isWIP) {
  const title = ":construction_worker: Work In Progress"
  const idea =
    "This PR appears to be a work in progress, and may not be ready to be merged yet."
  warn(`${title} - <i>${idea}</i>`)
}

if (hasLibChanges && !hasREADMEChanges) {
  warn("This pull request updates the library. Should the docs be updated?")
}

if (pastingTestsChanges.length > 0) {
  if (pastingTestsChanges.filter((p) => p.endsWith("snap"))) {
    warn("This PR may be introducing changes to the filtering")
  }
}

const hasPackageChanges = danger.git.modified_files.includes("package.json")
const hasLockfileChanges = danger.git.modified_files.includes(
  "package-lock.json",
)

if (hasPackageChanges && !hasLockfileChanges) {
  warn("There are package.json changes with no corresponding lockfile changes")
}

const linkDep = (dep) =>
  danger.utils.href(`https://www.npmjs.com/package/${dep}`, dep)

schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile("package.json")

  if (packageDiff.dependencies) {
    const added = packageDiff.dependencies.added
    const removed = packageDiff.dependencies.removed

    if (added.length) {
      const deps = danger.utils.sentence(added.map((d) => linkDep(d)))
      message(`Adding new dependencies: ${deps}`)
    }

    if (removed.length) {
      const deps = danger.utils.sentence(removed.map((d) => linkDep(d)))
      message(`:tada:, removing dependencies: ${deps}`)
    }
  }
})
