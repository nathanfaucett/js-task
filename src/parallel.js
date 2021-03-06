var once = require("@nathanfaucett/once"),
    asyncDone = require("@nathanfaucett/async_done"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    throwIfNotFunction = require("./throwIfNotFunction");


module.exports = parallel;


function parallel() {
    var functions = arguments;
    arrayForEach(functions, throwIfNotFunction);
    return createParallel(functions);
}

function createParallel(functions) {
    var length = functions.length;

    return function parallel(callback) {
        var cb = once(callback),
            i = -1,
            il = length - 1,
            count = length;

        function handler(error) {
            if (error) {
                cb(error);
            } else if (--count === 0) {
                cb();
            }
        }

        while (i++ < il) {
            asyncDone(functions[i], handler);
        }
    };
}
