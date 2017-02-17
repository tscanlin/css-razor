const cssRazor = require('./index')

console.log('Basic: should accept input HTML and CSS and output only the used CSS')

cssRazor({
  inputHtml: 'test/input/index.html',
  inputCss: 'test/input/index.css',
}, function(err, data) {
  const newCss = 'body {\n  font-size: 18px;\n}\n\n.some-element {\n  margin: 20px;\n}\n'
  console.assert(newCss === data.css, 'Basic: should accept input HTML and CSS and output only the used CSS')
})

console.log('Advanced: should accept input HTML and CSS and output only the used CSS')

cssRazor({
  inputHtml: 'test/input/tachyons.html',
  inputCss: 'test/input/tachyons.min.css',
}, function(err, data) {
  console.log(err, data);
  // const newCss = 'body {\n  font-size: 18px;\n}\n\n.some-element {\n  margin: 20px;\n}\n'
  // console.assert(newCss === data.css, 'Basic: should accept input HTML and CSS and output only the used CSS')
})
