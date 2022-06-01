import pkg from "./package.json"
import typescript from "@rollup/plugin-typescript"

const config = [
  {
    input: "src/lib/index.ts",
    external: ["draft-js"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [typescript()],
  },
]

export default config
