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

  return postprocessor.process(css);
};
