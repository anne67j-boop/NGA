/**
 * eslint.config.cjs
 * Flat config (ESLint v9+) for React + TypeScript + Vite
 * - Merges plugin recommended configs programmatically
 * - Integrates Prettier (eslint-config-prettier) last to disable conflicts
 *
 * Notes:
 * - Ensure tsconfig.json is at repo root or update parserOptions.project accordingly
 * - Install devDependencies (command provided below)
 */

const path = require('path');

// Programmatic plugin imports
const reactPlugin = require('eslint-plugin-react');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');

const getConfigRules = (cfg) => (cfg && cfg.rules) ? cfg.rules : {};
const reactRecommendedRules = getConfigRules(reactPlugin.configs && reactPlugin.configs.recommended);
const tsRecommendedRules = getConfigRules(tsPlugin.configs && tsPlugin.configs.recommended);
const reactHooksRecommendedRules = getConfigRules(reactHooksPlugin.configs && reactHooksPlugin.configs.recommended);
const jsxA11yRecommendedRules = getConfigRules(jsxA11yPlugin.configs && jsxA11yPlugin.configs.recommended);
const importRecommendedRules = getConfigRules(importPlugin.configs && importPlugin.configs.recommended);
const prettierRecommendedRules = getConfigRules(prettierConfig && prettierConfig.configs && prettierConfig.configs.recommended);

const mergedRules = {
  // plugin recommended rules
  ...reactRecommendedRules,
  ...tsRecommendedRules,
  ...reactHooksRecommendedRules,
  ...jsxA11yRecommendedRules,
  ...importRecommendedRules,

  // Project overrides and preferences
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }
  ],
  "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }],
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/restrict-template-expressions": [
    "warn",
    { allowNumber: true, allowBoolean: true, allowAny: false, allowNullish: false }
  ],

  "react/react-in-jsx-scope": "off",
  "react/prop-types": "off",
  "react/jsx-uses-vars": "error",
  "react/jsx-key": "error",
  "react/jsx-no-constructed-context-values": "warn",

  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",

  "jsx-a11y/no-autofocus": "off",
  "jsx-a11y/anchor-is-valid": "warn",

  "import/no-unresolved": "off",
  "import/order": [
    "warn",
    {
      groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true }
    }
  ],

  "eqeqeq": ["error", "always"],
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-debugger": "warn",
  "curly": ["error", "multi-line"],
  "prefer-const": ["error", { destructuring: "all" }],
  "consistent-return": "off",
};

// Apply Prettier disables last so they win
Object.assign(mergedRules, prettierRecommendedRules || {});

module.exports = [
  // Ignore compiled and dependency directories
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".turbo/**",
      "coverage/**",
      "public/**"
    ],
  },

  // Source files
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
      parser: require.resolve("@typescript-eslint/parser"),
      parserOptions: {
        project: [path.resolve(__dirname, "./tsconfig.json")],
        tsconfigRootDir: __dirname,
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        React: "readonly"
      },
    },

    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },

    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"]
        }
      }
    },

    rules: mergedRules,
  },

  // Node / scripts
  {
    files: ["**/*.{cjs,cts,mjs,mts}.js", "scripts/**", "config/**"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2020,
    },
    rules: {
      "no-console": "off",
    },
  },

  // Test files
  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}", "tests/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-expressions": "off",
    },
  },
];
