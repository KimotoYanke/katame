import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

const pkg = require("./package.json");

const libraryName = "index";

const plugins = [
  // Allow json resolution
  json(),
  // Compile TypeScript files
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: { compilerOptions: { module: "esnext" } }
  }),
  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),
  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  resolve(),

  // Resolve source maps to the original source
  sourceMaps()
];

export default [
  {
    input: `src/index.ts`,
    output: [
      {
        file: pkg.main,
        name: libraryName,
        format: "umd",
        sourcemap: true
      },
      { file: pkg.module, format: "es", sourcemap: true }
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.optionalDependencies)
    ],
    watch: {
      include: "src/**"
    },
    plugins
  }
];
