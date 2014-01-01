var annotate = require('annotate');
var is = require('annois');


module.exports = annotate('generate', 'Generates possible parameters based on given `generators` and `preconditions`').
    on(is.object, is.array, function(generators, preconditions) {
        var ret = preconditions.map(function(p) {
            if(p.name in generators) {
                return generators[p.name]();
            }
            else {
                console.warn('`' + p.name + '` does not have a generator!');
            }
        });

        if(ret.length == preconditions.length) {
            return ret;
        }
    });
