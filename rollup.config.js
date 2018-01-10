import babel from "rollup-plugin-babel"
import pkg from "./package.json"

export default [
  {
    input: "src/lib/index.js",
    external: ["draft-js"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
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
          "flow",
        ],
      }),
    ],
  },
]
