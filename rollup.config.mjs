import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"

const config = [
  {
    input: "./src/lib/index.ts",
    external: ["draft-js"],
    output: [
      { file: "dist/draftjs-filters.cjs.js", format: "cjs" },
      { file: "dist/draftjs-filters.esm.js", format: "es" },
    ],
    plugins: [typescript()],
  },
  {
    input: "./src/lib/index.ts",
    output: [{ file: "dist/draftjs-filters.d.ts", format: "es" }],
    plugins: [dts()],
  },
]

export default config
