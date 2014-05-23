'use strict';
var postcss, _remgex, _rootvalue, _options;

// Add pixel fallbacks for rem units to a string of CSS
// - css `String`: the contents of a CSS file.
// - rootvalue `String | Null`: The root element font size. Default = 16px.
// - options `Object`
//     - replace `Boolean`: Replace rems with pixels instead of providing
//       fallbacks. Default = false.

function Pixrem (rootvalue, options) {
  postcss = require('postcss');
  _remgex = /(\d*\.?\d+)rem/ig;
  _rootvalue = typeof rootvalue !== 'undefined' ? rootvalue : 16;
  _options = typeof options !== 'undefined' ? options : {
    replace: false
  };
}

Pixrem.prototype.process = function (css) {
  return postcss(this.postcss).process(css).css;
}

Pixrem.prototype.postcss = function (css) {
  css.eachDecl(function (decl, i) {
    var rule = decl.parent;
    var value = decl.value;

    if (value.indexOf('rem') != -1) {

      value = value.replace(_remgex, function ($1) {
        // Round decimal pixels down to match webkit and opera behavior:
        // http://tylertate.com/blog/2012/01/05/subpixel-rounding.html
        return Math.floor(parseFloat($1) * toPx(_rootvalue)) + 'px';
      });

      if (_options.replace) {
        decl.value = value;
      } else {
        rule.insertBefore(i, decl.clone({ value: value }));
      }
    }
  });
}

// Return a unitless pixel value from any root font-size value.
function toPx(value) {
  var parts = /^(\d+\.?\d*)([a-zA-Z%]*)$/.exec(value);
  var number = parts[1];
  var unit = parts[2];

  if (unit === 'px' || unit === '') {
    return parseFloat(number);
  }
  else if (unit === 'em' || unit === 'rem') {
    return parseFloat(number) * 16;
  }
  else if (unit === '%') {
    return (parseFloat(number) / 100) * 16;
  }

  // TODO: Should we throw an error here?
  return false;
}

var pixrem = function (rootvalue, options) {
  return new Pixrem(rootvalue, options);
};
pixrem.process = function(css, rootvalue, options) {
  return new Pixrem(rootvalue, options).process(css);
}

module.exports = pixrem;