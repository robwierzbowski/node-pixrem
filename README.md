# Pixrem

A CSS post-processor that generates pixel fallbacks for rem units.  
Written with [PostCSS](https://github.com/ai/postcss).  
Add it to your build process with [grunt-pixrem](https://github.com/robwierzbowski/grunt-pixrem).  

## Installation

`npm install --save node-pixrem`

## Usage

Pixrem is a CSS post-processor that, given CSS and a root em value, returns CSS with pixel unit fallbacks or replacements.

### Example

```js
'use strict';
var fs = require('fs');
var pixrem = require('pixrem');
var css = fs.readFileSync('main.css', 'utf8');
var processedCss = pixrem(css, '200%');

fs.writeFile('main.with-fallbacks.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
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

Report bugs and feature proposals in the [Github issue tracker](https://github.com/robwierzbowski/node-pixrem/issues). Run tests with jasmine-node. In lieu of a formal styleguide, take care to maintain the existing coding style. 

## Release History

0.1.1, Dec 14, 2013: Improve README copy.
0.1.0, Dec 14, 2013: Initial release.

## License

[BSD-NEW](http://en.wikipedia.org/wiki/BSD_License)
