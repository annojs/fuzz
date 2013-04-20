var math = require('funkit').math;
var generators = require('generators.js');
var is = require('annois');
var Render = require("tap-render");


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

    if(!is.array(preconditions)) {
        console.warn(name + ' is missing preconditions!');

        return;
    }

    preconditionSet = preconditions[math.randint(0, preconditions.length - 1)];

    params = preconditionSet.map(function(p) {
        return generators[p.name]();
    });

    params.unshift(fn);

    // TODO: provide better output for failing case
    r.push(null, {
        name: name + ' test ' + i,
        ok: inv.apply(undefined, params),
        operator: 'equal',
        expected: 'true',
        actual: 'false'
    });
}

module.exports = fuzz;
