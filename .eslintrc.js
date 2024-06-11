module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
  },

  extends: ['plugin:vue/recommended', '@vue/airbnb'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
      },
    ],
    'max-len': [2, {
      code: 190,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true,
      ignorePattern: 'd="([\\s\\S]*?)"',
    }],
    'array-bracket-newline': ['warn', { minItems: 3 }],
    'array-element-newline': ['warn', { minItems: 3 }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never',
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 7,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.return value
      ],
    }],
    "max-classes-per-file": ["error", 2],
    "lines-between-class-members": ["error", "never", { "exceptAfterSingleLine": true }],
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  overrides: [{
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
    env: {
      jest: true,
    },
  }],
};
