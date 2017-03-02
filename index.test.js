const Code = require('code') // assertion library
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const cssRazor = require('./index').default
const spawn = require('child_process').spawn

// Test output
const newCssSimple = 'body {\n  font-size: 20px;\n}\n\n.some-element {\n  margin: 20px;\n}\n\n.some-element .inner-element {\n  text-align: center;\n}\n\n.some-element > .inner-element {\n  color: blue;\n}\n'
const newCssComplex = '/*! TACHYONS v4.6.1 | http://tachyons.io */\n/*! normalize.css v5.0.0 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}a:active,a:hover{outline-width:0}img{border-style:none}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}/* 1 */ [type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}/* 1 */[hidden],template{display:none}.border-box,a,article,body,code,dd,div,dl,dt,fieldset,footer,form,h1,h2,h3,h4,h5,h6,header,html,input[type=email],input[type=number],input[type=password],input[type=tel],input[type=text],input[type=url],legend,li,main,ol,p,pre,section,table,td,textarea,th,tr,ul{box-sizing:border-box}img{max-width:100%}.ba{border-style:solid;border-width:1px}.b--black-10{border-color:rgba(0,0,0,.1)}.br2{border-radius:.25rem}.br--top{border-bottom-right-radius:0}.br--right,.br--top{border-bottom-left-radius:0}.db{display:block}.dt{display:table}.dtc{display:table-cell}.button-reset::-moz-focus-inner,.input-reset::-moz-focus-inner{border:0;padding:0}.lh-copy{line-height:1.5}.link,.link:active,.link:focus,.link:hover,.link:link,.link:visited{-webkit-transition:color .15s ease-in;transition:color .15s ease-in}.mw5{max-width:16rem}.w-100{width:100%}.overflow-hidden{overflow:hidden}.overflow-x-hidden{overflow-x:hidden}.overflow-y-hidden{overflow-y:hidden}.dark-gray{color:#333}.mid-gray{color:#555}.pa2{padding:.5rem}.mt1{margin-top:.25rem}.mt2{margin-top:.5rem}.mv0{margin-top:0;margin-bottom:0}.mv4{margin-top:2rem;margin-bottom:2rem}.tr{text-align:right}.f5{font-size:1rem}.f6{font-size:.875rem}.measure{max-width:30em}.center{margin-right:auto;margin-left:auto}.dim:active{opacity:.8;-webkit-transition:opacity .15s ease-out;transition:opacity .15s ease-out}.hide-child .child{opacity:0;-webkit-transition:opacity .15s ease-in;transition:opacity .15s ease-in}.hide-child:active .child,.hide-child:focus .child,.hide-child:hover .child{opacity:1;-webkit-transition:opacity .15s ease-in;transition:opacity .15s ease-in}.grow:active{-webkit-transform:scale(.9);transform:scale(.9)}.grow-large:active{-webkit-transform:scale(.95);transform:scale(.95)}@media screen and (min-width:30em){.overflow-hidden-ns{overflow:hidden}.overflow-x-hidden-ns{overflow-x:hidden}.overflow-y-hidden-ns{overflow-y:hidden}.pb3-ns{padding-bottom:1rem}.ph3-ns{padding-left:1rem;padding-right:1rem}.f4-ns{font-size:1.25rem}}@media screen and (min-width:30em) and (max-width:60em){.w-50-m{width:50%}.overflow-hidden-m{overflow:hidden}.overflow-x-hidden-m{overflow-x:hidden}.overflow-y-hidden-m{overflow-y:hidden}}@media screen and (min-width:60em){.w-25-l{width:25%}.overflow-hidden-l{overflow:hidden}.overflow-x-hidden-l{overflow-x:hidden}.overflow-y-hidden-l{overflow-y:hidden}}\n'

lab.experiment('css-razor', () => {

  lab.test('returns promise with used CSS based on input HTML & CSS', (done) => {
    cssRazor({
      html: ['test/input/index.html'],
      css: ['test/input/index.css'],
      outputFile: 'test/output/index.css'
    }).then((data) => {
      Code.expect(data.css).to.equal(newCssSimple)
      done()
    })
  })

  lab.test('calls callback with used CSS based on input HTML & CSS', (done) => {
    cssRazor({
      html: ['test/input/index.html'],
      css: ['test/input/index.css'],
      outputFile: 'test/output/index.css'
    }, function(err, data) {
      Code.expect(data.css).to.equal(newCssSimple)
      done()
    })
  })

  lab.test('returns promise with used CSS based on more complex input HTML & CSS', (done) => {
    cssRazor({
      html: ['test/input/tachyons.html'],
      css: ['test/input/tachyons.min.css'],
      outputFile: 'test/output/tachyons.css'
    }).then((data) => {
      Code.expect(data.css).to.equal(newCssComplex)
      done()
    })
  })


  lab.test('CLI returns used CSS based on input HTML & CSS', (done) => {
    const cli = spawn('./cli.js', [
      'test/input/index.html',
      'test/input/index.css',
    ])

    cli.stdout.on('data', (data) => {
      Code.expect(data.toString()).to.equal(newCssSimple)
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
