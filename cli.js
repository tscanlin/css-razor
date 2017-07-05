#!/usr/bin/env node

const cssRazor = require('./index.js').default
const defaultOptions = require('./defaultOptions.js')
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .argv

if (process.argv && process.argv.length > 2) {
  defaultOptions.outputFile = '' // Default to no output file over cli because of stdout.
  const options = Object.assign({}, defaultOptions, argv)

  options._.forEach((arg, i) => {
    if (arg.indexOf('.html') === arg.length - 5) {
      options.html.push(arg)
    } else if (arg.indexOf('.css') === arg.length - 4) {
      options.css.push(arg)
    }
    // TODO: Set more CLI options here.
  })

  cssRazor(options, (err, data) => {
    if (err) {
      process.stderr.write(err)
      process.exit(1)
    }
    if (options.stdout) {
      process.stdout.write(data.css)
      process.exit(0)
    }
  })
} else {
  throw new Error('You need to pass arguments to css-razor')
}
