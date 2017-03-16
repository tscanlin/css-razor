# css-razor

![Build Status](https://travis-ci.org/tscanlin/css-razor.svg?branch=master)

css-razor is a fast way to remove unused selectors from css. Essentially, it accomplishes the same goal as [uncss](https://github.com/giakki/uncss). However, it accomplishes this goal differently. Rather than loading a webpage in phantomjs and using `document.querySelector` to determine if a selector is being used, css-razor uses [cheeriojs](https://github.com/cheeriojs/cheerio) to parse static html and css files to removed unused selectors.

- Helps trim down CSS so you only keep the necessary parts
- Built for speed using the amazing  [cheeriojs](https://github.com/cheeriojs/cheerio)
- has an ignore list that can be added to
- ignores common pseudo elements & pseudo selectors by default
- Supports multiple files / globs
- Supports raw html & css input
- Supports html paths from URLs
- Reporting stats detailing how many selectors are removed.


## Getting Started

Install with npm

```bash
npm install --save-dev css-razor
```

You can then use the cli

```bash
css-razor build/css/index.css build/index.html --stdout > build/css/index.min.css
```

And you can even pass globs

```bash
css-razor build/css/*.css build/*.html --stdout > build/css/index.min.css
```

Or you can use the js api

```js
const cssRazor = require('css-razor').default

cssRazor({
  html: ['build/index.html'],
  css: ['build/css/index.css'],
}, function(err, data) {
  console.log(data.css)
})
```


## Options

```js
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
```


## Usage with Postcss

```js
const postcssRazor = require('css-razor').postcss

postcss([
    postcssRazor({
      html: "<html>your html string</html>",
    })
  ])
  .process(css, {
    from: 'index.css',
    to: 'output.css'
  })
```


## React to HTML Example

Below is an example of building an html file from a react app created with `create-react-app`. The resulting HTML file can then be used for server rendering and detecting selectors with css-razor.

index.js:
```js
import App from './components/App'
import './index.css'

if (typeof window !== 'undefined') { // Web
  ReactDOM.render(
    <App />,
    window.document.getElementById('root')
  )
} else { // Node / server render
  global.appToRender = App
}

```

buildStatic.js:
```js
const app = global.appToRender
const markup = ReactDOM.renderToString(ReactDOM.createElement(app));

const html = fs.readFileSync(HTML_FILE)
const newHtml = html.toString().split('<div id="root"></div>').join(
  '<div id="root">' + markup + '</div>'
)

fs.writeFileSync(HTML_FILE, newHtml, 'utf8')
```


## Todo

- html input via stdin?
- more tests for raw and globs
- test for postcss plugin usage
