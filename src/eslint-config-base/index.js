module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  rules: {
    'max-len': 0,
    // report prettier issues as errors
    'prettier/prettier': 'error',
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-interface': 0,

    // allow ts-ignore
    '@typescript-eslint/ban-ts-comment': 0,

    // ----- React: https://github.com/yannickcr/eslint-plugin-react

    // allow the use of types such as 'object' to conform with libraries such as react-final-form
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/consistent-type-imports': 'error',

    // note you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'import/no-anonymous-default-export': ['off'],
    'no-duplicate-imports': 'off',

    'jest/no-test-callback': 0,
    'jest/expect-expect': 0,

    'no-unsafe-optional-chaining': 'warn',
  },
};
