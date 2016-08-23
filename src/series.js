var once = require("@nathanfaucett/once"),
    asyncDone = require("@nathanfaucett/async_done"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    throwIfNotFunction = require("./throwIfNotFunction");


module.exports = series;


function series() {
    var functions = arguments;
    arrayForEach(functions, throwIfNotFunction);
    return createSeries(functions);
}

function createSeries(functions) {
    var length = functions.length;

    return function series(callback) {
        var cb = once(callback),
            index = 0;

        function next(error) {
            if (error) {
                cb(error);
            } else if (index === length) {
                cb();
            } else {
                asyncDone(functions[index++], next);
            }
        }

        next(undefined);
    };
}
