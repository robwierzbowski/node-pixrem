'use strict';
var fs = require('fs');
var pixrem = require('../lib/pixrem');
var css = fs.readFileSync('./test/app/test.css', 'utf8');

console.log(pixrem(css));
console.log(pixrem(css, '200%'));
console.log(pixrem(css, '200%', { replace: true }));
