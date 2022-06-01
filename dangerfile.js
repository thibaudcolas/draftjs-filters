const { danger, message, warn, fail, schedule } = require("danger")
const semanticRelease = require("semantic-release")
const envCi = require("env-ci")
const isLocal = !danger.github

const libModifiedFiles = danger.git.modified_files.filter(
  (path) => path.startsWith("src/lib") && path.endsWith("js"),
)
const hasLibChanges =
  libModifiedFiles.filter((filepath) => !filepath.endsWith("test.js")).length >
  0
const hasLibTestChanges =
  libModifiedFiles.filter(
    (filepath) =>
      filepath.endsWith("test.js") || filepath.endsWith("test.js.snap"),
  ).length > 0
const hasREADMEChanges = danger.git.modified_files.includes("README.md")

if (!isLocal) {
  const hasLabels = danger.github.issue.labels.length !== 0
  const isEnhancement =
    danger.github.issue.labels.some((l) => l.name === "enhancement") ||
    danger.github.pr.title.includes("feature")
  const isBug =
    danger.github.issue.labels.some((l) => l.name === "bug") ||
    danger.github.pr.title.includes("fix") ||
    danger.github.pr.title.includes("bug")

  if (!hasLabels) {
    message("What labels should we add to this PR?")
  }

  // Fails if the description is too short.
  if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
    fail(":grey_question: This pull request needs a description.")
  }

  if (hasLibChanges && !hasLibTestChanges && (isEnhancement || isBug)) {
    message("This PR may require new test cases")
  }

  // Warns if the PR title contains [WIP]
  const isWIP = danger.github.pr.title.includes("WIP")
  if (isWIP) {
    const title = ":construction_worker: Work In Progress"
    const idea =
      "This PR appears to be a work in progress, and may not be ready to be merged yet."
    warn(`${title} - <i>${idea}</i>`)
  }
}

if (hasLibChanges && !hasREADMEChanges) {
  warn("This pull request updates the library. Should the docs be updated?")
}

const hasPackageChanges = danger.git.modified_files.includes("package.json")
const hasLockfileChanges =
  danger.git.modified_files.includes("package-lock.json")

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

    if (added.includes("draft-js")) {
      warn(
        ":scream: this PR updates Draft.js! Please make sure to review the Draft.js CHANGELOG.",
      )
    }
  }
})

if (!isLocal) {
  schedule(async () => {
    // Retrieve the current branch so semantic-release is configured as if it was to make a release from it.
    const { branch } = envCi()

    const result = await semanticRelease({ dryRun: true, branch })
    if (result.nextRelease) {
      message(
        `:tada: Merging this will publish a new ${result.nextRelease.type} release, v${result.nextRelease.version}.`,
      )
    }
  })
}
