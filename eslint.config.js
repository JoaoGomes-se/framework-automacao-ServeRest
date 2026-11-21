const js = require("@eslint/js");
const globals = require("globals");
const prettier = require("eslint-config-prettier");
const jest = require("eslint-plugin-jest");

module.exports = [
  { ignores: ["node_modules/", "logs/", "reports/", "coverage/"] },
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      eqeqeq: "error",
      "prefer-const": "error",
    },
  },
  {
    files: ["tests/**/*.test.js"],
    ...jest.configs["flat/recommended"],
    languageOptions: {
      ...jest.configs["flat/recommended"].languageOptions,
      globals: { ...globals.node, ...globals.jest },
    },
  },
];
