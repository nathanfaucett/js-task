var tape = require("tape"),
    Stream = require("stream"),
    task = require("..");


tape("task(name, fn)", function(assert) {
    var count = 0;

    function createTask(name) {
        count += 1;

        function simple(done) {
            count -= 1;
            done();
        }
        simple.displayName = name;

        return simple;
    }

    function createStreamTask(name) {
        var mockedStream = new Stream.Readable();

        mockedStream._read = function() { /* do nothing */ };

        count += 1;

        function simple() {
            count -= 1;
            process.nextTick(function onNextTick() {
                mockedStream.emit("data", "");
                mockedStream.emit("end");
            });
            return mockedStream;
        }
        simple.displayName = name;

        return simple;
    }

    task("series", "series runs series0 and series1, one after the other", task.series(
        createTask("series0"),
        createStreamTask("series1")
    ));
    task("parallel", "parallel runs parallel0 and parallel1 in parallel", task.parallel(
        createTask("parallel0"),
        createStreamTask("parallel1")
    ));
    task("complex", "complex runs a simple functions, series and parallel", task.parallel(
        createTask("simple"),
        task("series"),
        task("parallel")
    ));

    task.on("Task.start", function(task) {
        console.log("Started " + task.name);
    });
    task.on("Task.end", function(task) {
        console.log("Finished " + task.name + " - " + (task.endTime - task.startTime));
    });

    assert.equal(
        task.help("complex"),
        " - complex:\n\r\tcomplex runs a simple functions, series and parallel\n\r"
    );

    task.run("complex", function onComplex(error) {
        assert.equal(!error, true);
        assert.equal(count, 0);
        assert.end();
    });
});
