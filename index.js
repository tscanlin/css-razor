const cheerio = require('cheerio')
const postcss = require('postcss')
const fs = require('fs')
const defaultConfig = require('./config')

function cssRazor(config, cb) {
  config = Object.assign({}, defaultConfig, config)
  if (!config.inputHtml || !config.inputCss) {
    throw new Error('You must include HTML and CSS for input.')
  }

  // const promise = !cb && new Promise()

  fs.readFile(config.inputHtml, (err, htmlData) => {
    const html = htmlData.toString()
    // console.log(html)
    fs.readFile(config.inputCss, (err, cssData) => {
      const css = cssData.toString()
      // console.log(css)

      postcss([
          (root) => {
            const $ = cheerio.load(html)
            return root.walk((node) => {
              if (node.type === 'rule') {
                const exists = checkExists(node, $)
                const ignore = config.ignore.some((ignore) => {
                  return node.selector.indexOf(ignore) !== -1
                })
                if (!exists && !ignore) {
                  node.remove()
                }
              }
            })
          }
        ])
        .process(css, { from: config.inputCss, to: config.outputFile })
        .then((result) => {
          if (cb) cb(null, result)

          if (config.outputFile) {
            fs.writeFile(config.outputFile, result.css)
          }
        })
        .catch((e) => {
          console.log(e)
          // return Promise.reject(e)
        })
    })
  })

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
}

module.exports = cssRazor
