var tape = require("tape"),
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

    task("series", task.series(
        createTask("series0"),
        createTask("series1")
    ));
    task("parallel", task.parallel(
        createTask("parallel0"),
        createTask("parallel1")
    ));
    task("complex", task.parallel(
        createTask("simple"),
        task("series"),
        task("parallel")
    ));

    task.run("complex", function onComplex(error) {
        assert.equal(!error, true);
        assert.equal(count, 0);
        assert.end();
    });
});
