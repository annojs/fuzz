var annotate = require('annotate');
var is = require('annois');


module.exports = annotate('generate', 'Generates possible parameters based on given `generators` and `preconditions`').
    on(is.object, is.array, function(generators, preconditions) {
        var args = [];
        var ret = preconditions.map(function(p) {
            if(is.fn(p)) {
                if(p.name in generators) {
                    var ret = generators[p.name].apply({
                        args: args
                    });

                    args.push(ret);

                    return ret;
                }
                else {
                    console.warn('`' + p.name + '` does not have a generator!');
                }
            }

            args.push(p);

            return p;
        });

        if(ret.length === preconditions.length) {
            return ret;
        }
    });
