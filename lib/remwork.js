'use strict';

module.exports = function remwork(css, rootvalue) {
  var postcss = require('postcss');
  var postprocessor = postcss(function (css) {

    css.eachDecl(function (decl, i) {
      var rule = decl.parent;
      var prop = decl.prop;
      var value = decl._value.trimmed;
      var remgex = /(\d+(\.\d+)?)rem/i;
      var rootvalue = rootvalue || 16; // Can we do this for defaults?

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

  return postprocessor.process(css);
};
