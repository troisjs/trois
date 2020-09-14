/* eslint-disable quote-props */
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:vue/essential',
    'standard',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'semi': [2, 'always'],
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
  },
};
