import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tseslint from "typescript-eslint";
import eslintConfigPrettier, { rules } from "eslint-config-prettier";

export default tseslint.config(
  // Ignore heavy folders
  { ignores: ["dist/**", ".yarn/**", ".pnp.*"] },

  // 1) FAST: non type-aware defaults (quick on-save)
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: { sourceType: "module" },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // 2) STRICT (type-aware) only for your source code (manual `yarn lint` or still ok on save)
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["src/**/*.ts"],
    languageOptions: {
      ...cfg.languageOptions,
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: true,
          ignoreIIFE: true,
        },
      ],
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-implied-eval": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksConditionals: true,
          checksVoidReturn: true,
          checksSpreads: true,
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/restrict-plus-operands": [
        "error",
        {
          skipCompoundAssignments: false, // check +=, -=, etc.
          allowAny: false,
          // (others available if you need):
          // allowBoolean: false,
          // allowNullish: false,
          // allowNumberAndString: false,
          // allowRegExp: false,
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: false,
          ignoreVoidOperator: true,
        },
      ],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
    },
  })),
  ...tseslint.configs.stylisticTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["src/**/*.ts"],
    languageOptions: {
      ...cfg.languageOptions,
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        // Enforce camelCase for variables and functions
        {
          selector: ["variable", "function"],
          format: ["camelCase"],
          leadingUnderscore: "allow", // e.g. _privateVar
        },
        // Enforce PascalCase for classes and types
        {
          selector: ["typeLike"], // covers interface, typeAlias, enum, class
          format: ["PascalCase"],
        },

        // Allow object literal property names to be any format (for APIs, JSON, etc.)
        {
          selector: "objectLiteralProperty",
          format: null,
        },
        // Allow interface names without “I” prefix (modern style)
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: true },
        },
      ],
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/ban-tslint-comment": "error",
      // "@typescript-eslint/consistent-generic-constructors": [
      //   "error",
      //   "type-argument",
      // ],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/type-annotation-spacing": "error",
    },
  })),

  // Disable stylistic rules that conflict with Prettier
  eslintConfigPrettier,
);
