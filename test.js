const cssRazor = require('./index').default
const spawn = require('child_process').spawn

const newCss = 'body {\n  font-size: 20px;\n}\n\n.some-element {\n  margin: 20px;\n}\n\n.some-element .inner-element {\n  text-align: center;\n}\n\n.some-element > .inner-element {\n  color: blue;\n}\n'

console.log('It should accept input HTML and CSS and output only the used CSS')
cssRazor({
  htmlFiles: ['test/input/index.html'],
  cssFiles: ['test/input/index.css'],
}, function(err, data) {
  console.assert(newCss === data.css)
})

console.log('It should return a promise')
cssRazor({
  htmlFiles: ['test/input/index.html'],
  cssFiles: ['test/input/index.css'],
}).then((data) => {
  console.assert(newCss === data.css)
})

console.log('It should work for more complicated examples without throwing errors.')
cssRazor({
  htmlFiles: ['test/input/tachyons.html'],
  cssFiles: ['test/input/tachyons.min.css'],
}, function(err, data) {
  console.assert(err === null)
})

console.log('It should work via cli')
const cli = spawn('./cli.js', [
  'test/input/index.html',
  'test/input/index.css',
])

cli.stdout.on('data', (data) => {
  console.assert(newCss === data.toString())
})

cli.on('close', (code) => {
  console.assert(code === 0)
})


console.log('\n  Tests completed successfully!\n\n')
process.exit(0)
