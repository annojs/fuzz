#!/usr/bin/env node
// parses TAP output. Example: ./tests.js | ./parse.js
var parser = require('tap-parser');
var p = parser(function (results) {
    console.dir(results);
});

process.stdin.pipe(p);
