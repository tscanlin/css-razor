'use strict';

const cheerio = require('cheerio')
const postcss = require('postcss')
const fs = require('fs')
const globby = require('globby')

require('es6-promise').polyfill()
require('isomorphic-fetch')

const defaultOptions = require('./defaultOptions')
const DELIMITER = ' || '

function cssRazor(options, callback) {
  let ignoreList = []
  if (typeof options.ignore === 'undefined') {
    ignoreList = defaultOptions.ignore.concat(options.ignore)  
  }
  options = Object.assign({}, defaultOptions, options)
  options.ignore = ignoreList

  if ( !( (options.htmlRaw || options.html.length || options.webpages.length) && (options.cssRaw || options.css.length) ) ) {
    throw new Error('You must include HTML and CSS for input.')
  }

  const p = new Promise(function(resolve, reject) {
    let htmlRaw = options.htmlRaw
    let cssRaw = options.cssRaw

    Promise.all([
      globby(options.html),
      globby(options.css)
    ]).then((pathsArray) => {
      const htmlFiles = pathsArray[0]
      const cssFiles = pathsArray[1]
      getTextFromUrls(options.webpages, (webHtml) =>
        getTextFromFiles(htmlFiles, (html) =>
          getTextFromFiles(cssFiles, (css) => {
            // TODO: Is there a better way to do this. I'd rather not nest it
            // but I don't want to pass more args either.
            function processInput(html, css) {
              const outputFile = options.overwriteCss
                ? cssFiles[0]
                : options.outputFile
              postcss([
                  postcssRazor({
                    html: html,
                    ignore: options.ignore,
                    report: options.report
                  })
                ])
                .process(css, {
                  from: options.inputCss,
                  to: outputFile
                })
                .then((result) => {
                  if (outputFile) {
                    fs.writeFile(outputFile, result.css, (err, d) => {
                      resolve(result)
                    })
                  } else {
                    resolve(result)
                  }
                })
                .catch((e) => {
                  reject(e)
                })
            }

            return processInput(html + htmlRaw + webHtml, css + cssRaw)
          })
        )
      )
    })
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
  let keepSelectors = ''
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
          keepSelectors += node.selector + DELIMITER
          keepCount++
        }
      }
    })

    // Remove empty media queries.
    root.walkAtRules((rule) => {
      if (rule.nodes.length === 0) {
        rule.remove()
      }
    });

    if (opt.report) {
      const percent = ((removeCount / (keepCount + removeCount)) * 100).toFixed()
      console.log('   Selectors kept: ' + keepCount)
      console.log('Selectors removed: ' + removeCount)
      console.log('  Percent removed: ' + percent + '%')
      console.log(' ')
      if (opt.reportDetails) {
        console.log('Removed selectors: ' + removeSelectors)
        console.log(' ')
        console.log('   Kept selectors: ' + keepSelectors)
      }
    }
  }
})

function getTextFromFiles(files, cb) {
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
  } else {
    cb(text)
  }
}

function getTextFromUrls(urls, cb) {
  let text = ''
  if (urls.length) {
    urls.forEach((file, i) => {
      fetch(file).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.text();
        }).then(function(responseText) {
          text += responseText

          if (i === urls.length - 1) {
            cb(text)
          }
        })
    })
  } else {
    cb(text)
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
