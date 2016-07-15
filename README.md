task [![Build Status](https://travis-ci.org/nathanfaucett/task.svg?branch=master)](https://travis-ci.org/nathanfaucett/task)
=======

task scheduler


```javascript
var task = require("@nathanfaucett/task");


task("series", task.series(
    function someSeriesTask0() {},
    function someSeriesTask1() {}
));
task("parallel", task.parallel(
    function someParallelTask0() {},
    function someParallelTask1() {}
));
task("complex", "this task is complex", task.parallel(
    function someSimpleTask() {},
    task("series"),
    task("parallel")
));

task.run("complex", function onComplex(error) {
    if (error) {
        // handler error
    } else {
        // ran all tasks
    }
});
```
