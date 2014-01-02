var annotate = require('annotate');
var is = require('annois');
var math = require('annomath');


module.exports = annotate('generate', 'Generates possible parameters based on given `generators` and `preconditions`').
    on(is.object, is.array, generate).
    on(is.fn, is.array, generate);

function generate(generators, preconditions) {
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
        if(is.array(p)) {
            var gen = generators[p[0].name];

            var ret = math.range(math.randint(0, 10)).map(function() {
                return gen.apply({
                    args: args
                });
            });

            args.push(ret);

            return ret;
        }

        args.push(p);

        return p;
    });

    if(ret.length === preconditions.length) {
        return ret;
    }
}
