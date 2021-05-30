module.exports = {
  parser: "@babel/eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  parserOptions: {
    sourceType: "module",
    babelOptions: {
      configFile: './.babelrc'
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    "no-unused-vars": "warn",
    "no-empty": "warn",
    "semi": ["error", "always"],
    "react/prop-types": "warn"
  }
};