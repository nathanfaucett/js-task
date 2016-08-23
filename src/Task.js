var now = require("@nathanfaucett/now"),
    apply = require("@nathanfaucett/apply");


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

    return function runTask(done) {
        task.start(emitter);
        return fn(function wrap() {
            task.end(emitter);
            return apply(done, arguments);
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
