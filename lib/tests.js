#!/usr/bin/env node
var annotate = require('annotate');
var is = require('annois');

var fuzz = require('./annofuzz');


// global default
fuzz._amount = 5;

var title = annotate('title', 'Returns given string in a title format.')
    .on(is.string, function(s) {
        return s && s.split(' ').map(capitalize).join(' ');
    }).satisfies(is.string);

fuzz(title, function(op, str) {
    var parts = op(str).split(' ');

    return false;
    return parts.map(fst).map(isUpper).filter(id).length == parts.length;
});

function capitalize(k) {
    return k[0].toUpperCase() + k.slice(1).toLowerCase();
}
function fst(a) {return a[0];}
function isUpper(a) {return a && a === a.toUpperCase();}
function id(a) {return a;}
