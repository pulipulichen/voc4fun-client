/* global _qunit_module_setup:false */
/* global $scope:false */
/* global _ctl:false */
/* global _var:false */
/* global _status:false */
module("controller_target.js", QUNIT_UTILS.module_setup("ctl_target"));

test("get_set_title()", function () {
    var _title = _ctl.get_set_title();
    equal(_title.substr(0, 2), "設定");
});

test("get_yesterday_target_data()", function (_assert) {
    var _done = _assert.async(1);
    
    // 新增昨天的記錄，要怎麼做好呢
    $scope.db_log.set_debug_log_day_offset(-1, function () {
        $scope.log("controller_target.js", "set_target()", {
            "learn_flashcard": 10,
            "take_note": 12,
            "test_select": 13
        });
        
        $scope.log("controller_target.js", "done()", "learn_flashcard", {
            done: 2
        });
    });
    
    _ctl.get_yesterday_target_data(function (_target_data) {
        $.console_trace(_target_data);
        equal(typeof(_target_data), "object", JSON.stringify(_target_data));
        _done();
    });
});

test("get_before_yesterday_target_data()", function (_assert) {
    var _done = _assert.async(1);
    
    // 新增昨天的記錄，要怎麼做好呢
    $scope.db_log.set_debug_log_day_offset(-2, function () {
        $scope.log("controller_target.js", "set_target()", {
            "learn_flashcard": 5,
            "take_note": 6,
            "test_select": 7
        });
        
        $scope.log("controller_target.js", "done()", "learn_flashcard", {
            done: 4
        });
        
        $scope.log("controller_target.js", "done()", "take_note", {
            done: 7
        });
        
        $scope.log("controller_target.js", "done()", "test_select", {
            done: 7
        });
    
        _ctl.get_before_yesterday_target_data(function (_target_data) {
            $.console_trace(_target_data);
            equal(typeof(_target_data), "object", JSON.stringify(_target_data));
            _done();
        });
    });
});