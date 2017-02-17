#!/usr/local/bin/node

const cssRazor = require('./index.js')

if (process.argv) {
  let html, css
  process.argv.forEach((arg) => {
    if (arg.indexOf('.html') === arg.length - 5) {
      html = arg
    } else if (arg.indexOf('.css') === arg.length - 4) {
      css = arg
    }
    // TODO: Set more CLI options here.
  })

  cssRazor({
    inputHtml: html,
    inputCss: css,
  }, (err, data) => {
    process.stdout.write(data.css)
  })
}
