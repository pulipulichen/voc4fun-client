var controller_test_select = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_test_select.js";

    // ------------------------------

    var _var = {};

    _var.test_select = {
        "question": "",
        "options": [],
        "options_index": [],
        "answer": undefined,
        "correct": 0,
        "flashcard_id": 0
    };

    _var.test_select_transition = {};

    _var._test_select_mock = {
        "question": "問題",
        "options": ["answer1", "answer2", "answer3"],
        "options_index": [1, 2, 3],
        "answer": undefined,
        "correct": 0,
        "flashcard_id": 0
    };
    
    _var.show_note = false;

    _ctl.var = _var;

    // ----------------------------------------

    var _status_key = "test_select";

    var _status = {
        stack: [],
        history_stack: []
    };

    var _init_status = function () {
        return $scope.db_status.add_listener(
                _status_key,
                function (_s) {
                    //$.clone_json(_ctl.status, _s);
                    _ctl.status = _s;
                    _status = _s;
                },
                function () {
                    return _ctl.status;
                }
        );
    };
    _init_status();

    _ctl.status = _status;

    // --------------------

    _ctl.enter = function (_callback, _do_animation) {
        // 讓選單保持在選取的狀態
        $scope.ons_view.active_menu(3);
        
        return _ctl.next(_callback, _do_animation);
    };

    _ctl.next = function (_callback, _do_animation) {
        if (typeof (_callback) === "boolean") {
            _do_animation = _callback;
            _callback = undefined;
        }
        
        var _do_callback = function () {
            _ctl.setup_hint();
            $.trigger_callback(_callback);
        };

        //$.trigger_callback(_callback);

        //var _test = _var._test_select_mock;
        _ctl.get_test_flashcard(function (_test, _mode) {
            // 不是在這裡加進去的
            //_ctl.add_history_stack(_test.flashcard_id);

            $scope.log(_log_file, "next()", _mode, _test);
            if (_do_animation === true) {
                _ctl._transition_next(_test, _do_callback);
            }
            else {
                _var.test_select = _test;
                
                ons.digest();
                
                app.navi.replacePage("test_select.html", {
                    "animation": "none",
                    "onTransitionEnd": _do_callback
                });
            }
        });

    };
    
    _ctl.setup_hint = function () {
        var _note = _var.test_select.note;
        var _hint = $(".test-select-page .hint");
        //$.console_trace("setup_hint() " + _hint.length, _var.test_select.note);
        if (_note === null || _note === undefined || $.trim(_note) === "") {
            //$.console_trace("關閉");
            _hint.hide();
        }
        else {
            //$.console_trace("開啟");
            _hint.show();
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
        //_status.stack.push(_id);
        if ($.inArray(_id, _status.stack) === -1) {
            _status.stack.push(_id);
        }
        $scope.db_status.save_status(_status_key);
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
            _ctl._give_correct_answer();
        }
        else {
            _ctl._give_incorrect_answer();
        }

        $scope.db_status.save_status(_status_key);
        
        // 不管答案正不正確，都發出聲音
        //$.console_trace(_test_select.options[_test_select.correct].q);
        //$scope.ctl_activity.speak(_test_select.options[_test_select.correct].q, 'en')
        
        return this;
    };

    _ctl._give_correct_answer = function () {
        var _test_select = _var.test_select;
        $scope.ctl_target.done_plus("test_select");

        // 把這個答案從stack中移除
        _status.stack = $.array_slice_all_element(_test_select.flashcard_id, _status.stack);

        // 如果剩下的問題都相同，則合併
        _status.stack = $.array_merge_if_same(_status.stack);

        // 如果合併後跟現在的flashcard_id相同，則不再進行測驗
        if (_status.stack.length === 1
                && _status.stack[0] === _test_select.flashcard_id) {
            _status.stack = [];
        }
        
        // 把這個動作加入history stack中
        _ctl.add_history_stack(_test_select.flashcard_id);
        
        return this;
    };

    _ctl._give_incorrect_answer = function () {
        var _test_select = _var.test_select;
        $scope.ctl_learn_flashcard.status.review_stack.push(_test_select.flashcard_id);
        _status.stack.push(_test_select.flashcard_id);
        
        // 把答錯的選項也加入待答的範圍
        var _answer = _test_select.answer;
        var _answered_option_flashcard_id = _test_select.options[_answer].id;
        //$scope.ctl_learn_flashcard.status.review_stack.push(_answered_option_flashcard_id);
        $scope.ctl_learn_flashcard.add_incorrect_answer_to_review_stack(_answered_option_flashcard_id);
        _status.stack.push(_answered_option_flashcard_id);
        
        _status.stack = $.array_merge_if_same(_status.stack);
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

    var _option_length = $scope.CONFIG.test_select_option_learn;
    
    _ctl.get_test_flashcard = function (_callback) {
        _var.show_note = false;
        var _qualifier = "review";
        
        var _test_select = _var.test_select;
        // 從陣列中讀取

        var _flashcard_id;
        if (_status.stack.length > 0) {
            _flashcard_id = $.array_get_random(_status.stack
                    , _test_select.flashcard_id);
        }
        else {
            //_flashcard_id = _test_select.flashcard_id;
            //while (_flashcard_id === _trans_page.flashcard_id) {
            //    _flashcard_id = $.get_random($scope.ctl_flashcard.flashcard_count);
            //}
            _flashcard_id = $.array_get_random(_status.history_stack
                    , _test_select.flashcard_id);
            //$.console_trace("get from history_stack", [_flashcard_id, _test_select.flashcard_id]);
            _qualifier = "history";
        }
        var _options = [];

        $scope.ctl_flashcard.get_flashcard(_flashcard_id, function (_flashcard) {
            _test_select.flashcard_id = _flashcard.id;
            _test_select.question = _flashcard.a;
            _test_select.note = _flashcard.note;
//            _test_select.note = null;
//            _test_select.note = "";
//            $.console_trace("note", _test_select.note);
//            $scope.$digest();
            
            //_test_select.note = "AAA";
            
            _options.push(_flashcard);

            $scope.ctl_flashcard.get_other_flashcards(
                    _flashcard_id,
                    (_option_length - 1),
                    function (_other_cards) {
                        //$.console_trace("get_other_flash_card " + (_option_length - 1), _other_cards);
                        for (var _o = 0; _o < _other_cards.length; _o++) {
                            _options.push(_other_cards[_o]);
                        }

                        _options = $.array_shuffle(_options);
                        var _correct = -1;
                        for (var _i = 0; _i < _options.length; _i++) {
                            if (_flashcard_id === _options[_i].id) {
                                _correct = _i;
                                break;
                            }
                        }

                        _test_select.options = _options;
                        _test_select.correct = _correct;
                        _test_select.answer = undefined;

                        $.trigger_callback(_callback, _test_select, _qualifier);
                    });
        });
    };

    _ctl.add_history_stack = function (_flashcard_id) {
        if (_flashcard_id === undefined || _flashcard_id === null) {
            return this;
        }
        if ($.inArray(_flashcard_id, _status.history_stack) === -1) {
            _status.history_stack.push(_flashcard_id);
        }
        return this;
    };
    
    _ctl.get_tested_count = function () {
        return _status.history_stack.length;
    };

    // -----------------------------------

    $scope.ctl_test_select = _ctl;
};