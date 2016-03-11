var once = require("once"),
    isString = require("is_string"),
    isFunction = require("is_function"),
    series = require("./series"),
    parallel = require("./parallel");


module.exports = create;


function create() {
    var _tasks = {};

    function task(name, fn) {
        if (isFunction(name)) {
            fn = name;
            name = fn.displayName || fn.name;
        }

        if (!fn) {
            return _tasks[name];
        } else {
            if (!name) {
                throw new TypeError("task name must be specified");
            }
            if (!isString(name)) {
                throw new TypeError("task name must be a string");
            }
            if (!isFunction(fn)) {
                throw new TypeError("task function must be specified");
            }

            _tasks[name] = fn;

            return fn;
        }
    }

    function run(name, callback) {
        var cb = once(callback),
            task = _tasks[name];

        if (isFunction(task)) {
            return task(cb);
        } else {
            throw new Error("No task named " + name);
        }
    }

    task.run = run;
    task.series = series;
    task.parallel = parallel;
    task.create = create;

    return task;
}
