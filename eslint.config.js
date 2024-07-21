import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin"

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: true
            },
        },
        plugins: {
            "@stylistic": stylistic,
            "@typescript-eslint": tseslint.plugin
        },
        rules: {
            "@stylistic/no-multi-spaces": "off",
            "@stylistic/brace-style": ["error", "allman"],
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/eol-last": ["error", "always"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/indent-binary-ops": "off",
            "@stylistic/key-spacing": "off",
            "@stylistic/linebreak-style": ["error", "windows"],
            "@stylistic/new-parens": ["error", "always"],
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "return" },
                { blankLine: "always", prev: "*", next: "continue" },
                { blankLine: "always", prev: "*", next: "break" },
                { blankLine: "always", prev: "*", next: "if" },
                { blankLine: "always", prev: "if", next: "*"}
            ],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "never"],
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "no-constant-condition": ["error", { "checkLoops": false }],
            "eqeqeq": "error",
            ...tseslint.configs.recommendedTypeChecked.rules
        }
    }
]
