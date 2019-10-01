module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here
  },
  env: {
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
    },
    ecmaVersion: 10,
    parser: 'babel-eslint',
    sourceType: 'module',
  }
}
