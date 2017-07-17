module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017
  },
  env: {
    node: true,
    es6: true
  },
  // ecmaFeatures: {
  //   modules: true
  // },
  plugins: ['prettier'],
  rules: {
    'import/no-unassigned-import': 'off',
    'prettier/prettier': [
      'error',
      {singleQuote: true, semi: false, bracketSpacing: false, printWidth: 100}
    ]
  }
}
