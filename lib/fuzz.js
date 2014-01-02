var math = require('annomath');
var is = require('annois');
var Render = require('tap-render');


module.exports = function(generators) {
    if(!(is.object(generators) || is.fn(generators))) {
        throw new Error('You should pass a module to annofuzz!');
    }

    var generate = require('./generate').bind(null, generators);
    var ret = fuzz.bind(null, generate);

    ret.generate = generate;

    return ret;
};

function fuzz(generate, fn, inv, amount) {
    amount = amount || 1;

    var r = Render();

    r.pipe(process.stdout);

    r.begin();

    runTests(generate, r, fn, inv, amount);

    r.close();
}

function runTests(generate, r, fn, inv, amount) {
    math.range(amount).forEach(runTest.bind(null, generate, r, fn, inv));
}

function runTest(generate, r, fn, inv, i) {
    var preconditions = fn._preconditions;
    var name = fn._name;
    var preconditionSet;
    var paramsFailed;
    var params;
    var ok;

    if(!is.array(preconditions)) {
        return console.warn('`' + name + '` is missing preconditions!');
    }

    preconditionSet = preconditions[math.randint(0, preconditions.length - 1)];

    params = generate(preconditionSet);

    if(!params) {
        return;
    }

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
