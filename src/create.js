var apply = require("@nathanfaucett/apply"),
    has = require("@nathanfaucett/has"),
    vfs = require("vinyl-fs"),
    once = require("@nathanfaucett/once"),
    isString = require("@nathanfaucett/is_string"),
    isFunction = require("@nathanfaucett/is_function"),
    EventEmitter = require("@nathanfaucett/event_emitter"),
    objectForEach = require("@nathanfaucett/object-for_each"),
    watch = require("./watch"),
    series = require("./series"),
    parallel = require("./parallel"),
    Task = require("./Task");


module.exports = create;


function create() {
    var _tasks = {},
        _taskDescription = {},
        _emitter = new EventEmitter();

    function task(name, description, fn) {
        var newTask;

        if (isFunction(description)) {
            fn = description;
            description = "";
        }
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

            if (description) {
                _taskDescription[name] = description;
            }
            newTask = _tasks[name] = Task.create(name, fn, _emitter);
            newTask.name = newTask.displayName = name;

            return newTask;
        }
    }

    function run(name, callback) {
        var cb = once(callback),
            task = _tasks[name];

        if (isFunction(task)) {
            return task(cb);
        } else {
            throw new Error("No task found named " + name);
        }
    }

    function help(name) {
        var tasks = _tasks,
            localHas = has,
            ret;

        if (name && localHas(tasks, name)) {
            return taskToString(tasks[name], _taskDescription[name], name);
        } else {
            ret = "";

            for (name in tasks) {
                if (localHas(tasks, name)) {
                    ret += taskToString(tasks[name], _taskDescription[name], name);
                }
            }

            return ret;
        }
    }

    function getName(fn) {
        return fn.displayName || fn.name || "<unknown>";
    }

    function getDescription(fn) {
        return _taskDescription[fn.displayName || fn.name];
    }

    function each(fn) {
        return objectForEach(_tasks, fn, task);
    }

    objectForEach(EventEmitter.prototype, function each(fn, name) {
        if (isFunction(fn)) {
            task[name] = function emitterFunction() {
                apply(fn, arguments, _emitter);
            };
        }
    });

    task.src = vfs.src;
    task.dest = vfs.dest;
    task.symlink = vfs.symlink;
    task.watch = watch;

    task.run = run;
    task.help = help;
    task.create = create;

    task.series = series;
    task.parallel = parallel;

    task.getName = getName;
    task.getDescription = getDescription;
    task.each = task.forEach = each;

    return task;
}

function taskToString(fn, description, displayName) {
    if (!description) {
        return " - " + displayName + "\n\r";
    } else {
        return " - " + displayName + ":\n\r\t" + description + "\n\r";
    }
}
