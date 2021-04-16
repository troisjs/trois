module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    'standard',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  // parserOptions: {
  //   ecmaVersion: 2020,
  // },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'semi': ['error', 'never'],
    'space-before-function-paren': 'off',
    'one-var': 'off',
    'quotes': 'off',
    'quote-props': 'off',
    'object-curly-newline': 'off',
    'no-unused-vars': 'warn',
    // 'comma-dangle': ['warn', 'always-multiline'],
    'comma-dangle': ['warn', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'indent': 'warn',
    'no-new': 'off',
    'object-property-newline': 'off',
    'eqeqeq': 'warn',
    'no-multiple-empty-lines': 'off',

    '@typescript-eslint/ban-ts-comment': 'warn',
    // '@typescript-eslint/ban-ts-comment': ['warn', {
    //   'ts-ignore': 'allow-with-description',
    // }],
    // 'vue/valid-template-root': 'off',
    'vue/no-multiple-template-root': 'off',

    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['warn'],
  },
}
