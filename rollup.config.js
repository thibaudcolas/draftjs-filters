import babel from "rollup-plugin-babel"
import pkg from "./package.json"

const BANNER = `// @flow`
const CJS_BANNER = `${BANNER}
/*:: import type { ContentState, EditorState } from "draft-js"*/`

export default [
  {
    input: "src/lib/index.js",
    external: ["draft-js"],
    output: [
      { file: pkg.main, format: "cjs", banner: CJS_BANNER },
      { file: pkg.module, format: "es", banner: BANNER },
    ],
    plugins: [
      babel({
        babelrc: false,
        exclude: ["node_modules/**"],
        presets: [
          [
            "env",
            {
              modules: false,
            },
          ],
        ],
        plugins: ["transform-flow-comments"],
      }),
    ],
  },
]
