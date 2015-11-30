/* global _qunit_module_setup:false */
/* global $scope:false */
/* global _ctl:false */
/* global _var:false */
/* global _status:false */
module("db_log.js", QUNIT_UTILS.module_setup("db_log"));

test("get_latest_log()", function (_assert) {
    var _done = _assert.async(1);
    _ctl.get_latest_log({
        callback: function (_log) {
            equal(typeof (_log), "object", JSON.stringify(_log));
            _done();
        }
    });
});

test("get_latest_log_timestamp()", function (_assert) {
    var _done = _assert.async(1);
    _ctl.get_latest_log_timestamp(function (_timestamp) {
        equal(typeof (_timestamp), "number", _timestamp);
        _done();
    });
});

test("sync()", function (_assert) {
    //$scope.log("db_log.qunit.js", "sync()", "test");
    var _done = _assert.async(1);
    _ctl.sync(function () {
        //equal(typeof (_timestamp), "number", _timestamp);
        ok(true);
        _done();
    });
});
