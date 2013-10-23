var math = require('funkit').math;
var is = require('annois');
var Render = require('tap-render');

var generators;


function fuzz(fn, inv, amount) {
    amount = fuzz._amount || amount;
    var r;

    r = Render();

    r.pipe(process.stdout);

    r.begin();

    runTests(r, fn, inv, amount);

    r.close();
}

function runTests(r, fn, inv, amount) {
    for(var i = 0; i < amount; i++) runTest(r, i, fn, inv);
}

function runTest(r, i, fn, inv) {
    var preconditions = fn._preconditions;
    var name = fn._name;
    var preconditionSet;
    var params;
    var ok;

    if(!is.array(preconditions)) return console.warn(name + ' is missing preconditions!');

    preconditionSet = preconditions[math.randint(0, preconditions.length - 1)];

    params = preconditionSet.map(function(p) {
        return generators[p.name]();
    });

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

module.exports = function(gen) {
    if(!is.object(gen)) throw new Error('You should pass a module to annofuzz!');

    generators = gen;

    return fuzz;
};
