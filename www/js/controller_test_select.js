var controller_test_select = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_test_select.js";

    // ------------------------------

    var _var = {};
    
    _var.test_select = {
        "question": "",
        "options": [],
        "answer": undefined,
        "correct": 0
    };
    
    _var.test_select_transition = {};
    
    _var._test_select_mock = {
        "question": "問題",
        "options": ["answer1", "answer2", "answer3"],
        "answer": undefined,
        "correct": 0
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

    _ctl.next = function (_callback, _do_animation) {
        if (typeof(_callback) === "boolean") {
            _do_animation = _callback;
            _callback = undefined;
        }
        
        //$.trigger_callback(_callback);
        
        var _test = _var._test_select_mock;
        $scope.log(_log_file, "next()", undefined, _test);
        if (_do_animation === true) {
            _ctl._transition_next(_test, _callback);
        }
        else {
            _var.test_select = _test;
            $scope.$digest();
            app.navi.replacePage("test_select.html", {
                "animation": "none",
                "onTransitionEnd": _callback
            });
        }
        
    };
    
    var _page = "test_select.html";
    var _trans_page = "test_select_transition.html";
    
    _ctl._transition_next = function (_test, _callback) {

        $scope.ons_view.transition_next({
            "page": _page,
            "trans_page": _trans_page,
            "set_trans_page": function () {
                _var.test_select_transition = _test;
            },
            "set_page": function () {
                _var.test_select = _test;
            },
            "animtation": "lift",
            "callback": _callback
        });
        
    };

    // ----------------------

    _ctl.add_test_stack = function (_id) {
        _status.stack.push(_id);
        return this;
    };
    
    _ctl.set_answer = function (_answer) {
        if (_ctl.is_answered() === true) {
            return this;
        }
        _var.test_select.answer = _answer;
        _ctl.check_answer_correct();
    };
    
    _ctl.check_answer_correct = function () {
        
        var _test_select = _var.test_select;
        var _question = _test_select.question;
        var _answer = _test_select.options[_test_select.answer];
        var _correct = (_var.test_select.answer === _var.test_select.correct);
        
        $scope.log(_log_file, "check_answer_correct()", _correct, {
            question: _question,
            answer: _answer
        });
        
        if (_correct === true) {
            $scope.ctl_target.done_plus("test_select");
        }
    };
    
    _ctl.is_answered = function () {
        return (_var.test_select.answer !== undefined);
    };
    
    _ctl.is_correct_answer = function (_index) {
        if (_ctl.is_answered() === false) {
            return false;
        }
        //var _answer = _var.test_select.answer;
        var _correct = _var.test_select.correct;
        if (_correct === _index) {
            return true;
        }
    };
    
    _ctl.is_incorrect_answer = function (_index) {
        if (_ctl.is_answered() === false) {
            return false;
        }
        var _answer = _var.test_select.answer;
        var _correct = _var.test_select.correct;
        if (_answer === _index && _correct !== _index) {
            return true;
        }
    };

    $scope.ctl_test_select = _ctl;
};