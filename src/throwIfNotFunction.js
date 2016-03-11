var isFunction = require("is_function");


module.exports = throwIfNotFunction;


function throwIfNotFunction(fn) {
    if (!isFunction(fn)) {
        throw new TypeError("function expected");
    }
}
