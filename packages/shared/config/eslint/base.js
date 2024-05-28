/** @type {import("eslint").Linter.Config} */
const config = {
  plugins: ["@typescript-eslint", "import", "prettier"],
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "on"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true
  },
  ignorePatterns: [
    "**/.eslintrc.cjs",
    "**/*.config.js",
    "**/*.config.cjs",
    "packages/config/**",
    ".next",
    "dist",
    "pnpm-lock.yaml",
  ],
}

module.exports = config;