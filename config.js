module.exports = {
  // Array of HTML file globs.
  html: [],
  // Array of CSS file globs.
  css: [],
  // Raw HTML string.
  htmlRaw: '',
  // Raw CSS string.
  cssRaw: '',
  // Array of webpages to add to HTML.
  webpages: [],
  // Strings in CSS classes to ignore.
  ignore: [
    'html', // global element
    'body', // global element
    'button', // global element

    'active', // state class
    'inactive', // state class
    'collapsed', // state class
    'expanded', // state class
    'show', // state class
    'hide', // state class
    'hidden', // state class
    'is-', // state class
  ],
  // Where to output
  outputFile: 'dist/index.css',
  // Disable output via stdout w/ `--no-stdout`.
  stdout: false,
  // Report Stats about used vs unused selectors.
  report: false,
  // Detailed Report Stats including every selector used vs unused.
  reportDetails: false,
  // Overwrite the input css file if there is only one.
  overwriteCss: false,
}
