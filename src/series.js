var once = require("@nathanfaucett/once"),
    asyncDone = require("@nathanfaucett/async_done"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    prepareFunctions = require("./prepareFunctions");


module.exports = series;


function series(emitter, functions) {
    arrayForEach(functions, prepareFunctions(emitter));
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
