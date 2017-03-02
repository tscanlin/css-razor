module.exports = {
  // Array of HTML file globs.
  html: [],
  // Array of CSS file globs.
  css: [],
  // Raw HTML string.
  htmlRaw: '',
  // Raw CSS string.
  cssRaw: '',
  // Strings in CSS classes to ignore.
  ignore: [
    'html', // global
    'body', // global
    'button', // global
    'active', // state
    'inactive', // state
    'collapsed', // state
    'expanded', // state
    'show', // state
    'hide', // state
    'hidden', // state
    'is-', // state
  ],
  // Where to output
  outputFile: 'dist/index.css',
  // Disable output via stdout w/ `--no-stdout`.
  stdout: false,
  // Report Stats about used vs unused selectors.
  report: false
}
