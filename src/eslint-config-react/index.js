module.exports = {
  plugins: ['react', 'jsx-a11y', 'react-hooks', 'use-effect-no-deps'],
  extends: ['plugin:react/recommended', '../eslint-config-base'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    // https://github.com/yannickcr/eslint-plugin-react
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
    },
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { name: 'Link', linkAttribute: 'to' },
    ],
  },
  rules: {
    // ----- React: https://github.com/yannickcr/eslint-plugin-react
    // disable the need for prop-types
    'react/prop-types': 0,
    // disable the need for a displayName
    'react/display-name': 0,
    // disable the need for a react import
    'react/react-in-jsx-scope': 0,

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'use-effect-no-deps/use-effect-no-deps': 'error',

    '@next/next/no-img-element': 'off',
    '@next/next/no-document-import-in-page': 'off',
    '@next/next/google-font-display': 'off',

    // ----- JSX a11y: https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    // 'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/alt-text': 'off',
    // 'jsx-a11y/anchor-has-content': 'warn',
    // 'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
    // 'jsx-a11y/aria-props': 'warn',
    // 'jsx-a11y/aria-proptypes': 'warn',
    // 'jsx-a11y/aria-role': 'warn',
    // 'jsx-a11y/aria-unsupported-elements': 'warn',
    // 'jsx-a11y/heading-has-content': 'warn',
    // 'jsx-a11y/href-no-hash': 'warn',
    // 'jsx-a11y/iframe-has-title': 'warn',
    // 'jsx-a11y/img-redundant-alt': 'warn',
    // 'jsx-a11y/no-access-key': 'warn',
    // 'jsx-a11y/no-distracting-elements': 'warn',
    // 'jsx-a11y/no-redundant-roles': 'warn',
    // 'jsx-a11y/role-has-required-aria-props': 'warn',
    // 'jsx-a11y/role-supports-aria-props': 'warn',
    // 'jsx-a11y/scope': 'warn',
  },
};
