/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: true,
  bracketSameLine: true,
  arrowParens: 'avoid',
  plugins: [
    require.resolve('prettier-plugin-organize-imports'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
};
