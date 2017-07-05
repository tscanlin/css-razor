const Code = require('code') // assertion library
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const cssRazor = require('./index').default
const spawn = require('child_process').spawn

// Test output
const testResults = require('./test/results.js')

lab.experiment('css-razor', () => {

  lab.test('returns promise with used CSS based on input HTML & CSS', (done) => {
    cssRazor({
      html: ['test/input/index.html'],
      css: ['test/input/index.css'],
      outputFile: 'test/output/index.css'
    }).then((data) => {
      Code.expect(data.css.split('\r').join('')).to.equal(testResults.simpleCss)
      done()
    })
  })

  lab.test('calls callback with used CSS based on input HTML & CSS', (done) => {
    cssRazor({
      html: ['test/input/index.html'],
      css: ['test/input/index.css'],
      outputFile: 'test/output/index.css'
    }, function(err, data) {
      Code.expect(data.css.split('\r').join('')).to.equal(testResults.simpleCss)
      done()
    })
  })

  lab.test('returns promise with used CSS based on more complex input HTML & CSS', (done) => {
    cssRazor({
      html: ['test/input/tachyons.html'],
      css: ['test/input/tachyons.min.css'],
      outputFile: 'test/output/tachyons.css'
    }).then((data) => {
      Code.expect(data.css.split('\r').join('')).to.equal(testResults.complexCss)
      done()
    })
  })

  lab.test('calls callback with used CSS based on more complex input webpage & CSS', (done) => {
    cssRazor({
      webpages: ['http://blog.timscanlin.net/'],
      css: ['test/input/tachyons.min.css'],
      outputFile: 'test/output/tachyons.css'
    }, function(err, data) {
      Code.expect(data.css.split('\r').join('')).to.equal(testResults.complexHttpCss)
      done()
    })
  })

  lab.test('CLI returns used CSS based on input HTML & CSS', (done) => {
    const cli = spawn('node', [
      './cli.js',
      'test/input/index.html',
      'test/input/index.css',
    ])

    cli.stdout.on('data', (data) => {
      Code.expect(data.toString().split('\r').join('')).to.equal(testResults.simpleCss)
    })

    cli.on('close', (code) => {
      Code.expect(code).to.equal(0)
      done()
    })
  })

  // empty input
  // no files

  // multiple files
  // raw
  // postcss
  // set output file

})
