var math = require('annomath');
var is = require('annois');
var Render = require('tap-render');

var generate = require('./generate');


module.exports = function(generators) {
    if(!is.object(generators)) {
        throw new Error('You should pass a module to annofuzz!');
    }

    return fuzz.bind(null, generators);
};

function fuzz(generators, fn, inv, amount) {
    var generator = generate.bind(null, generators);
    var r = Render();

    r.pipe(process.stdout);

    r.begin();

    runTests(generator, r, fn, inv, amount);

    r.close();
}

function runTests(generator, r, fn, inv, amount) {
    for(var i = 0; i < amount; i++) {
        runTest(generator, r, i, fn, inv);
    }
}

function runTest(generator, r, i, fn, inv) {
    var preconditions = fn._preconditions;
    var name = fn._name;
    var preconditionSet;
    var paramsFailed;
    var params;
    var ok;

    if(!is.array(preconditions)) return console.warn('`' + name + '` is missing preconditions!');

    preconditionSet = preconditions[math.randint(0, preconditions.length - 1)];

    params = generator(preconditionSet);

    if(!params) return;

    params.unshift(fn);

    ok = inv.apply(undefined, params);
    extra = ok? '': ' with parameters ' + params.slice(1).join(', ');
    r.push(null, {
        name: name + ' test ' + i + extra,
        ok: ok,
        operator: 'equal',
        expected: 'true',
        actual: 'false'
    });
}
