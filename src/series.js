var once = require("@nathanfaucett/once"),
    asyncDone = require("@nathanfaucett/async_done"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    throwIfNotFunction = require("./throwIfNotFunction");


module.exports = series;


function series() {
    var args = arguments;
    arrayForEach(args, throwIfNotFunction);
    return createSeries(args);
}

function createSeries(args) {
    var length = args.length;

    return function series(callback) {
        var cb = once(callback),
            index = 0;

        function next(error) {
            if (error) {
                cb(error);
            } else if (index === length) {
                cb();
            } else {
                asyncDone(args[index++], next);
            }
        }

        next(undefined);
    };
}
