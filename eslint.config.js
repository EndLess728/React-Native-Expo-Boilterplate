const expoConfig = require('eslint-config-expo/flat.js');
const prettier = require('eslint-plugin-prettier/recommended');
const compiler = require('eslint-plugin-react-compiler');
const unistyles = require('eslint-plugin-react-native-unistyles');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  // 1. Basic Ignores
  {
    ignores: [
      '**/dist/*',
      '**/node_modules/*',
      '**/__tests__/*',
      '**/coverage/*',
      '**/.expo/*',
      '**/.expo-shared/*',
      '**/android/*',
      '**/ios/*',
      '**/.vscode/*',
      '**/docs/*',
      '**/cli/*',
      '**/expo-env.d.ts',
      '**/babel.config.js',
      '**/metro.config.js',
    ],
  },

  // 2. Base Expo Config (Flattens automatically if it's an array, but we spread to be safe)
  ...expoConfig,

  // 3. Prettier Integration
  prettier,

  // 4. React Compiler
  {
    plugins: {
      'react-compiler': compiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },

  // 5. Obytes & Custom Rules (Unistyles, Import Sorting, Unused Imports)
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      'react-native-unistyles': unistyles,
    },
    rules: {
      // Import Sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Unused Imports - forcefully remove them
      'no-unused-vars': 'off', // disable default
      '@typescript-eslint/no-unused-vars': 'off', // disable default TS
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Unistyles
      'react-native-unistyles/no-unused-styles': 'error',

      // React Native / Expo best practices
      'react/display-name': 'off',
      'react/no-inline-styles': 'off', // Allow inline styles if needed, or set to 'warn'
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
    },
  },

  // 6. TypeScript specific overrides if needed (Expo config handles most)
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Allow requires in some places if absolutely necessary, but generally Expo config handles this.
      // Re-enable require imports for specific non-source files if needed, but globally off is safer for source.
    },
  },

  // 7. Config files specific overrides (allow require)
  {
    files: ['*.config.js', 'app.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off', // for __dirname etc in simple js files
    },
  },
];
