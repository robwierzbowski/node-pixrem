'use strict';
var fs = require('fs');
var remwork = require('../lib/remwork');
var css = fs.readFileSync('./test/app/test.css', 'utf8');

console.log(remwork(css, 20));
