module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2018
  },
  env: {
    "browser": true,
    "node": true,
  },
  rules: {
    "no-unused-vars": "warn",
    "no-empty": "warn",
    "semi": ["error", "always"],
    "react/prop-types": "warn"
  }
};