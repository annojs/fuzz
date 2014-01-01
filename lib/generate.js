module.exports = function(generators, preconditions) {
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
};
