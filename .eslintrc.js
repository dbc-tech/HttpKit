module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'prettier'],

  ignorePatterns: ['dist/**', '.eslintrc.js', '*.config.js'],

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prettier/prettier': 'error',
  },
}
