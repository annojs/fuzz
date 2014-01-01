#!/usr/bin/env node
var annotate = require('annotate');
var is = require('annois');

var generators = require('annogenerate');
var fuzz = require('./fuzz')(generators);


var title = annotate('title', 'Returns given string in a title format').
    on(is.string, function(s) {
        return s && s.split(' ').map(capitalize).join(' ');
    }).satisfies(is.string);

fuzz(title, function(op, str) {
    var parts = op(str).split(' ');

    return parts.map(fst).map(isUpper).filter(id).length == parts.length;
}, 5);

fuzz(title, function(op, str) {
    return false;
}, 1);

// this test has invariants that don't have generators
var demo = annotate('demo', 'Just a demo function').
    on(function() {return true;}, noop, noop);

fuzz(demo, function(op, str) {
    return true;
}, 1);

function capitalize(k) {
    return k[0].toUpperCase() + k.slice(1).toLowerCase();
}
function fst(a) {return a[0];}
function isUpper(a) {return a && a === a.toUpperCase();}
function id(a) {return a;}
function noop() {}
