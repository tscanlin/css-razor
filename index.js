const cheerio = require('cheerio')
const postcss = require('postcss')
const fs = require('fs')
const defaultConfig = require('./config')
const DELIMITER = '  /  '

function cssRazor(config, callback) {
  config = Object.assign({}, defaultConfig, config)

  if ( !( (config.rawHtml || config.htmlFiles.length) && (config.rawCss || config.cssFiles.length) ) ) {
    throw new Error('You must include HTML and CSS for input.')
  }

  const p = new Promise(function(resolve, reject) {
    let rawHtml = config.rawHtml
    let rawCss = config.rawCss

    getFiles(config.htmlFiles, (html) =>
      getFiles(config.cssFiles, (css) =>
        processInput(html + rawHtml, css + rawCss)
      )
    )

    function processInput(html, css) {
      postcss([
          postcssRazor({
            html: html,
            ignore: config.ignore,
            report: config.report
          })
        ])
        .process(css, { from: config.inputCss, to: config.outputFile })
        .then((result) => {
          if (config.outputFile) {
            fs.writeFile(config.outputFile, result.css, (err, d) => {
              resolve(result)
            })
          }
        })
        .catch((e) => {
          reject(e)
        })
    }
  })

  // Enable callback support too.
  if (callback) {
    p.then((result) => {
      callback(null, result)
    })
  }

  return p
}

const postcssRazor = postcss.plugin('postcss-razor', (opt) => {
  const html = opt.html
  let keepCount = 0
  let removeCount = 0
  let removeSelectors = ''
  return (root) => {
    const $ = cheerio.load(html)
    root.walk((node) => {
      if (node.type === 'rule') {
        const exists = checkExists(node, $)
        const ignore = opt.ignore.some((ignore) => {
          return node.selector.indexOf(ignore) !== -1
        })
        if (!exists && !ignore) {
          node.remove()
          removeSelectors += node.selector + DELIMITER
          removeCount++
        } else {
          keepCount++
        }
      }
    })

    if (opt.report) {
      console.log('   Selectors kept: ' + keepCount)
      console.log('Selectors removed: ' + removeCount)
      console.log('  Percent removed: ' + removeCount / (keepCount + removeCount))
      console.log(' ')
      console.log('Removed selectors: ' + removeSelectors)
    }
  }
})

function getFiles(files, cb) {
  let text = ''
  if (files.length) {
    files.forEach((file, i) => {
      fs.readFile(file, (err, data) => {
        text += data.toString()

        if (i === files.length - 1) {
          cb(text)
        }
      })
    })
  }
}

function checkExists(node, $) {
  // Right now this try is needed because cheerio doesn't handle `pseudo-element` well.
  // See: https://github.com/cheeriojs/cheerio/issues/979
  try {
    return $(removePseudoClasses(node.selector)).length > 0
  } catch (e) {
    return true
  }
}

function removePseudoClasses(selector) {
  return [
    ':active',
    ':focus',
    ':hover',
    ':visited',
    '::before',
    ':before',
    '::after',
    ':after',
  ].reduce((p, c) => {
    return p.split(c).join('')
  }, selector)
}

module.exports = {
  default: cssRazor,
  postcss: postcssRazor,
}
