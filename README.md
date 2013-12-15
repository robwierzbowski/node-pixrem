# Pixrem

Add pixel fallbacks for rems.  
A CSS post-processor written with [PostCSS](https://github.com/ai/postcss). 

## Installation

`npm install --save node-pixrem`

## Usage

Pixrem is a CSS post-processor that adds pixel fallbacks or replacements to your CSS. You can use it as a node package or add it to your Grunt build process with [grunt-pixrem](https://github.com/robwierzbowski/grunt-pixrem).

### Example

<!-- TODO: make sure this works -->

```js
'use strict';
var fs = require('fs');
var pixrem = require('pixrem');
var css = fs.readFileSync('main.css', 'utf8');
var processedCss = pixrem(css, '200%');

fs.writeFile('main.with-fallbacks.css', processedCss, function (err) {
  if (err) throw err;
  console.log('IE8, you\'re welcome.');
});
```

### Parameters

#### css

Type: `String`  

Some CSS to process.

#### rootvalue

Type: `String | Null`  
Default: `16px`  

The root element font size. Can be a px, rem, em, percent, or unitless pixel value.

#### options

Type: `Object | Null`  
Default: `{ replace: false }`  

- `replace` replaces rules containing rems instead of adding fallbacks.

## Contribute

Report bugs and feature proposals in the [Github issue tracker](https://github.com/robwierzbowski/XXX/issues). In lieu of a formal styleguide, take care to maintain the existing coding style. 

## Release History

0.1.0, XXX: Initial release.

## License

[BSD-NEW](http://en.wikipedia.org/wiki/BSD_License)
