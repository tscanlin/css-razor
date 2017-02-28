module.exports = {
  // Array of HTML files.
  htmlFiles: [],
  // Array of CSS files.
  cssFiles: [],
  // Raw HTML string.
  rawHtml: '',
  // Raw CSS string.
  rawCss: '',
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
  stdout: true,
  // Report Stats about used vs unused selectors.
  report: false
}
