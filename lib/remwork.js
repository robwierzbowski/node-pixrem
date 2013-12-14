'use strict';

module.exports = function remwork(css, rootval) {
  var postcss = require('postcss');
  var remgex = /(\d+(\.\d+)?)rem/i;
  var rootvalue = rootval || 16;
  var postprocessor = postcss(function (css) {

    css.eachDecl(function (decl, i) {
      var rule = decl.parent;
      var prop = decl.prop;
      var value = decl._value.trimmed;

      if (value.match(remgex)) {

        while (value.match(remgex)) {
          // Easy way to pull anon function outside of the loop for perf?
          value = value.replace(remgex, function ($1) {
            return parseFloat($1) * rootvalue + 'px';
          });
        }

        rule.insertBefore(i, {
          prop: prop,
          value: value
        });
      }
    });
  });

  // Return a unitless pixel value from any CSS value.
  function toPx(value) {
    var parts = /^(\d+\.?\d*)([a-zA-Z%]*)$/.exec(value);
    var number = parts[1];
    var unit = parts[2];

    if (unit === 'px' || typeof unit === 'undefined') {
      return number;
    }
    else if (unit === 'em' || unit === 'rem') {
      return parseFloat(number) * 16;
    }
    else if (unit === '%') {
      return (parseFloat(number) / 100) * 16;
    }

    return false;
  }

  return postprocessor.process(css);
};
