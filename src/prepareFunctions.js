var isFunction = require("@nathanfaucett/is_function"),
    Task = require("./Task");


module.exports = prepareFunctions;


function prepareFunctions(emitter) {
    return function prepareFunction(fn) {
        if (!isFunction(fn)) {
            throw new TypeError("function expected");
        } else {
            return Task.create(fn, fn.displayName || fn.name, emitter);
        }
    };
}
