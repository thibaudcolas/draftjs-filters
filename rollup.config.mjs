import pkg from "./package.json" assert { type: "json" }
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"

const config = [
  {
    input: "./src/lib/index.ts",
    external: ["draft-js"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [typescript()],
  },
  {
    input: "./src/lib/index.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  },
]

export default config
