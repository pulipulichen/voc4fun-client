var controller_test_select = function ($scope) {
    
    var _ctl = {};
    
    // ------------------------------
    
    var _var = {
        "question": "",
        "answer": [],
        "correct_index": 0
    };
    
    _ctl.var = _var;
    
    // ----------------------------------------
    
    var _status = {
        stack: [],
        error_stack: [],
        index: 0
    };
    
    _ctl.status = _status;
    
    // --------------------
    
    _ctl.enter = function () {
        _ctl.next(function () {
            app.navi.replacePage("test_select.html");
        }, false);
    };
    
    _ctl.next = function (_callback, _do_animation) {
        $.trigger_callback(_callback);
    };
    
    _ctl.prev = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_test_select = _ctl;
};