'use strict';

module.exports = function remwork(css, rootvalue) {
  var postcss = require('postcss');
  var remgex = /(\d+(\.\d+)?)rem/i;
  var rootvalue = typeof rootvalue !== 'undefined' ? rootvalue : 16;
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
            return parseFloat($1) * toPx(rootvalue) + 'px';
          });
        }

        rule.insertBefore(i, {
          prop: prop,
          value: value
        });
      }
    });
  });

  // Return a number in pixels from any CSS value.
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

  return postprocessor.process(css);
};
