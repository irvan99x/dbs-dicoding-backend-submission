module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "require-jsdoc": 0,
    "react/react-in-jsx-scope": 0,
    "no-underscore-dangle": 0,
    "camelcase": 0,
    "class-methods-use-this": 0,
    "no-unused-vars": 0,
    "no-console": 0
  },
};
