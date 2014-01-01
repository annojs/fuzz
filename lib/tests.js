#!/usr/bin/env node
var annotate = require('annotate');
var is = require('annois');

var generators = require('annogenerate');
var fuzz = require('./fuzz')(generators);


generators.largerThanMin = function() {
    return generators.number(this.args[1]);
};

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
});

// constants
var constant = annotate('constant', 'Returns constant results').
    on(1, 1).
    on('foo', 'foo');

fuzz(constant, function(op, a) {
    return op(a) == a;
}, 5);

// this test has invariants that don't have generators
var demo = annotate('demo', 'Just a demo function').
    on(function() {return true;}, noop, noop);

fuzz(demo, function(op, str) {
    return true;
});

// dependent preconditions
var clamp = annotate('clamp', 'Clamps given number between given bounds').
    on(is.number, is.number, function largerThanMin(a, args) {
        return is.number(a) && args[1] <= a;
    }, function(a, min, max) {
        return Math.max(Math.min(a, max), min);
    });

fuzz(clamp, function(op, a, min, max) {
    var res = op(a, min, max);

    return min <= res && res <= max;
}, 5);

// variable amount of args
var min = annotate('min', 'Returns minimum of the given numbers').
    on([is.number], Math.min);

fuzz(min, function(op, args) {
    var res = op.apply(null, args);

    return Math.min.apply(null, args) === res;
}, 5);

function capitalize(k) {
    return k[0].toUpperCase() + k.slice(1).toLowerCase();
}
function fst(a) {return a[0];}
function isUpper(a) {return a && a === a.toUpperCase();}
function id(a) {return a;}
function noop() {}
