'use strict';

// Add pixel fallbacks for rem units to a string of CSS
// - css `String`: the contents of a CSS file.
// - rootvalue `String | Null`: The root element font size. Default = 16px.
// - options `Object`
//     - replace `Boolean`: Replace rems with pixels instead of providing
//       fallbacks. Default = false.
// }
module.exports = function pixrem(css, rootvalue, options) {
  var postcss = require('postcss');
  var remgex = /(\d*\.?\d+)rem/i;
  var rootvalue = typeof rootvalue !== 'undefined' ? rootvalue : 16;
  var options = typeof options !== 'undefined' ? options : {
    replace: false
  };
  var postprocessor = postcss(function (css) {

    css.eachDecl(function (decl, i) {
      var rule = decl.parent;
      var prop = decl.prop;
      var value = decl._value.trimmed;

      if (value.match(remgex)) {

        while (value.match(remgex)) {
          // TODO: Is there an easy way to pull anon function outside of the
          // loop for perf?
          value = value.replace(remgex, function ($1) {
            // Round decimal pixels down to match webkit and opera behavior:
            // http://tylertate.com/blog/2012/01/05/subpixel-rounding.html
            return Math.floor(parseFloat($1) * toPx(rootvalue)) + 'px';
          });
        }

        rule.insertBefore(i, {
          prop: prop,
          value: value
        });

        if (options.replace) {
          decl.remove(i);
        }
      }
    });
  });

  // Return a unitless pixel value from any root font-size value.
  function toPx(value) {
    var parts = /^(\d*\.?\d+)([a-zA-Z%]*)$/.exec(value);
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

  return postprocessor.process(css);
};
