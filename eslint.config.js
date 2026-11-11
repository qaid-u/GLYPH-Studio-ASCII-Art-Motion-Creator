import parser from '@typescript-eslint/parser';
export default [{files:['src/**/*.{ts,tsx}','tests/**/*.ts'],languageOptions:{parser,parserOptions:{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true}}},rules:{'no-unreachable':'error','no-dupe-args':'error','no-constant-condition':'error','no-duplicate-case':'error'}}];
