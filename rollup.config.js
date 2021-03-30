import babel from "rollup-plugin-babel"
import pkg from "./package.json"

var BANNER = `// @flow`
const CJS_BANNER = `${BANNER}
/*:: import type { ContentState, EditorState } from "draft-js"*/`

const config = [
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
            "@babel/preset-env",
            {
              modules: false,
            },
          ],
        ],
        plugins: ["@babel/plugin-transform-flow-comments"],
      }),
    ],
  },
]

export default config
