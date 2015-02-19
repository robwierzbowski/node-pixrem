'use strict';
var postcss, _remgex, _PROPS, _VALUES, _rootvalue, _options;
var calc = require('reduce-css-calc');

// Add pixel fallbacks for rem units to a string of CSS
// - css `String`: the contents of a CSS file.
// - rootvalue `String | Null`: The root element font size. Default = 16px.
// - options `Object`
//     - replace `Boolean`: Replace rems with pixels instead of providing
//       fallbacks. Default = false.
//     - atrules `Boolean`: Replace rems in at-rules too. Default = false

function Pixrem (rootvalue, options) {
  postcss = require('postcss');
  _remgex = /(\d*\.?\d+)rem/ig;
  _PROPS  = /^(background-size|border-image|border-radius|box-shadow|clip-path|column|grid|mask|object|perspective|scroll|shape|size|stroke|transform)/;
  _VALUES = /(calc|gradient)\(/;
  _rootvalue = typeof rootvalue !== 'undefined' ? rootvalue : 16;
  _options = typeof options !== 'undefined' ? options : {
    replace : false,
    atrules : false,
    html    : true
  };
}

Pixrem.prototype.process = function (css, options) {
  return postcss(this.postcss).process(css, options).css;
};

Pixrem.prototype.postcss = function (css) {

  var vendor = require('postcss/lib/vendor');

  if (_options.html) {
    // First, check root font-size
    css.eachRule(function (rule) {
      if (rule.parent && rule.parent.type === 'atrule') { return; }
      if (/(html|:root)/.test(rule.selectors)) {
        rule.eachDecl(function (decl) {
          if (decl.prop === 'font-size') {
            _rootvalue = decl.value;
          } else if (decl.prop === 'font' && decl.value.match(/\d/)) {
            _rootvalue = decl.value.match(/.*?([\d\.]*(em|px|rem|%|pt|pc))/)[1];
          }
        });
      }
    });
  }

  //Then, for each rules
  css.eachRule(function (rule) {

    // do not convert rem if in at-rule
    if (!_options.atrules) {
      if (rule.type === 'atrule' || (rule.parent && rule.parent.type === 'atrule')) { return; }
    }

    rule.eachDecl(function (decl, i) {
      var value = decl.value;

      if (value.indexOf('rem') !== -1) {

        var prop = vendor.unprefixed(decl.prop);
        // replace rems only if needed
        if (!(_VALUES.test(value) || _PROPS.test(prop))) {

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
      }
    });

  });

};

// Return a unitless pixel value from any root font-size value.
function toPx (value) {
  value = (typeof value === 'string' && value.indexOf('calc(') !== -1) ? calc(value) : value;
  var parts = /^(\d+\.?\d*)([a-zA-Z%]*)$/.exec(value);
  if (parts !== null) {
    var number = parts[1];
    var unit   = parts[2];

    if (unit === 'px' || unit === '') {
      return parseFloat(number);
    }
    else if (unit === 'em' || unit === 'rem') {
      return parseFloat(number) * 16;
    }
    else if (unit === '%') {
      return (parseFloat(number) / 100) * 16;
    }
  } else {
    throw new Error('Root font-size is invalid');
  }
}

var pixrem = function (rootvalue, options) {
  return new Pixrem(rootvalue, options);
};
pixrem.process = function (css, rootvalue, options, postcssoptions) {
  return new Pixrem(rootvalue, options).process(css, postcssoptions);
};
pixrem.postcss = function (css) {
  return new Pixrem().postcss(css);
};

module.exports = pixrem;
