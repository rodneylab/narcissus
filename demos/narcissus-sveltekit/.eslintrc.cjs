module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier', 'airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  rules: {},
};
