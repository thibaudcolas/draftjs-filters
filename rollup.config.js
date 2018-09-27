import babel from "rollup-plugin-babel"
import pkg from "./package.json"

const BANNER = `// @flow
/*:: import type { ContentState } from "draft-js"*/`

export default [
  {
    input: "src/lib/index.js",
    external: ["draft-js"],
    output: [
      { file: pkg.main, format: "cjs", banner: BANNER },
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
