var tape = require("tape"),
    Stream = require("stream"),
    fs = require("fs"),
    filePath = require("@nathanfaucett/file_path"),
    task = require("..");


tape("task(name, fn)", function(assert) {
    var count = 0;

    function createTask(name) {
        count += 1;

        function simple(done) {
            count -= 1;
            setTimeout(done, Math.random() * 100);
        }
        simple.displayName = name;

        return simple;
    }

    function createStreamTask(name) {
        var readable = new Stream.Readable(),
            writable = new Stream.Writable();

        readable._read = function() {};

        writable.writable = true;
        writable.write = function() {};

        count += 1;

        function simple() {
            setTimeout(function onNextTick() {
                count -= 1;
                readable.emit("data", "DATA");
                readable.emit("end");
            }, Math.random() * 100);
            return readable.pipe(writable);
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
        console.log("Starting " + task.name);
    });
    task.on("Task.end", function(task) {
        console.log("Finished " + task.name + " after " + (task.endTime - task.startTime) + " ms");
    });

    task.each(function each(fn, name) {
        assert.equal(task.getName(fn), name);
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

tape("task.watch(glob, fn, options)", function(assert) {
    var file = filePath.join(__dirname, "file.txt"),
        called = 0,
        watcher = task.watch(filePath.join(__dirname, "**/*.txt"), function onChange() {

            fs.readFile(file, function(e, b) {
                var string;

                if (e) {
                    assert.end(e);
                } else {
                    string = b.toString();
                    called += 1;

                    if (string === "123") {
                        watcher.close();
                        assert.equals(called, 2);
                        assert.end();
                    }
                }
            });
        });

    watcher.on("ready", function onReady() {
        setTimeout(function onTimeout() {
            fs.writeFile(file, "abc", function onWrite() {
                setTimeout(function onTimeout() {
                    fs.writeFile(file, "123", function onWrite() {});
                }, 500);
            });
        }, 500);
    });
});
