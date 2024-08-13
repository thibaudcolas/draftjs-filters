/* eslint-disable @typescript-eslint/no-explicit-any */
import { diff } from "jest-diff"

type Options = {
  expand?: boolean
  colors?: boolean
  contextLines?: number
  aAnnotation?: string
  bAnnotation?: string
}

const defaultOptions = {
  expand: false,
  contextLines: -1, // Forces to use default from Jest
  aAnnotation: "First value",
  bAnnotation: "Second value",
}

const SNAPSHOT_TITLE = "Snapshot Diff:\n"

const identity = (value: any) => value

const snapshotDiff = (valueA: any, valueB: any, options?: Options): string => {
  const mergedOptions = { ...defaultOptions, ...options }

  const difference = diffStrings(valueA, valueB, mergedOptions) as string

  return SNAPSHOT_TITLE + difference
}

// https://github.com/facebook/jest/tree/d81464622dc8857ba995ed04e121af2b3e8e33bc/packages/jest-diff#example-of-options-for-no-colors
const noDiffColors = {
  aColor: identity,
  bColor: identity,
  changeColor: identity,
  commonColor: identity,
  patchColor: identity,
}

function diffStrings(valueA: any, valueB: any, options: Options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    contextLines: options.contextLines,
    aAnnotation: options.aAnnotation,
    bAnnotation: options.bAnnotation,
    ...noDiffColors,
  })
}

export default snapshotDiff
