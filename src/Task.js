var now = require("@nathanfaucett/now"),
    asyncDone = require("@nathanfaucett/async_done");


var TaskPrototype;


module.exports = Task;


function Task(name) {
    this.name = name;
    this.startTime = null;
    this.endTime = null;
}
TaskPrototype = Task.prototype;

Task.create = function(name, fn, emitter) {
    var task = new Task(name);

    return function runTask(cb) {
        task.start(emitter);
        return asyncDone(fn, function onDone(error) {
            task.end(emitter);
            if (error) {
                cb(error);
            } else {
                cb();
            }
        });
    };
};

TaskPrototype.start = function(emitter) {
    this.startTime = now.stamp();
    emitter.emit("Task.start", this);
};

TaskPrototype.end = function(emitter) {
    this.endTime = now.stamp();
    emitter.emit("Task.end", this);
};
