var controller_test_select = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_test_select.js";

    // ------------------------------

    var _var = {
        "question": "",
        "answer": [],
        "correct_index": 0
    };

    _ctl.var = _var;

    // ----------------------------------------

    var _status_key = "test_select";

    var _status = {
        stack: [],
        //error_stack: [],
        index: 0
    };

    var _init_status = function () {
        return $scope.db_status.add_listener(
                _status_key,
                function (_s) {
                    $.clone_json(_ctl.status, _s);
                },
                function () {
                    return _ctl.status;
                }
        );
    };
    _init_status();

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

    // ----------------------

    _ctl.add_test_stack = function (_id) {
        _status.stack.push(_id);
        return this;
    };

    $scope.ctl_test_select = _ctl;
};