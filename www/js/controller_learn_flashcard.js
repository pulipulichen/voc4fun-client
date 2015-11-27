var controller_learn_flashcard = function ($scope) {

    // ------------------------------

    var _ctl = {};

    // ------------------------------

    var _var = {};

    _var.learn_flashcard = {
        q: "",
        a: "",
        note: "",
        other_note_count: 0,
        other_note: []
    };

    _var.learn_flashcard_transition = {};

    _var._learn_flashcard_mock_a = {
        q: "English A",
        a: "中文的說明 A",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
        other_note_count: 0,
        other_note: []
    };

    _var._learn_flashcard_mock_b = {
        q: "English B",
        a: "中文的說明 B",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
        other_note_count: 0,
        other_note: []
    };

    _ctl.var = _var;

    // ----------------------------------------------

    var _status = {
        /**
         * 給上一頁下一頁瀏覽記錄用的
         */
        history_stack: [],
        /**
         * 歷史記錄的索引
         */
        history_index: -1,
        /**
         * 查詢單字卡用的索引
         */
        flashcard_index: 0,
        /**
         * 需要複習的單字卡索引，保存的是ID喔
         */
        review_stack: []
    };

    _ctl.status = _status;

    // -----------------------------------------

    _ctl.enter = function () {
        _ctl.init(function () {
            //$.console_trace("enter");
            app.navi.replacePage("learn_flashcard.html");
        });
    };

    _ctl.init = function (_callback) {
        if (_status.history_stack.length > 0) {
            if (_status.history_index < 0) {
                _status.history_index = 0;
            }
            _ctl.set_history_flashcard(_callback);
        }
        else {
            _ctl.next(_callback, false);
        }
    };

    _ctl.next = function (_callback, _do_animation) {
        //var _flashcard = _var._learn_flashcard_mock_b;

        var _trans_callback = function (_flashcard) {
            if (_do_animation === undefined || _do_animation !== false) {
                _ctl._transition_next(_flashcard, _callback);
            }
            else {
                _var.learn_flashcard = _flashcard;
                $.trigger_callback(_callback);
            }
        };

        if (_ctl.is_last_of_stack() === true) {
            var _push_history_stack = function (_flashcard) {
                _status.history_stack.push(_flashcard.id);
                _status.history_index++;
                _trans_callback(_flashcard);
                //$.trigger_callback(_callback);
            };
            if (_ctl.get_new_flashcard_type() === "new") {
                _ctl.add_new_flashcard(_push_history_stack);
            }
            else {
                _ctl.add_review_flashcard(_push_history_stack);
            }
        }
        else {
            $.console_trace("不是最後一個的情況")
            _status.history_index++;
            _ctl.set_history_flashcard(function (_flashcard) {
                _trans_callback(_flashcard);
            });
        }
    };

    var _page = "learn_flashcard.html";
    var _trans_page = "learn_flashcard_transition.html";

    _ctl._transition_next = function (_flashcard, _callback) {

        $scope.ons_view.transition_next({
            "page": _page,
            "trans_page": _trans_page,
            "set_trans_page": function () {
                _var.learn_flashcard_transition = _flashcard;
            },
            "set_page": function () {
                _var.learn_flashcard = _flashcard;
            },
            "animtation": "lift",
            "callback": _callback
        });
    };

    _ctl.prev = function (_callback) {
        //var _flashcard = _var._learn_flashcard_mock_a;
        _status.history_index--;
        $.console_trace(_status.history_index);
        _ctl.set_history_flashcard(function (_flashcard) {
            _ctl._transition_prev(_flashcard, _callback);
        });
    };

    _ctl._transition_prev = function (_flashcard, _callback) {

        $scope.ons_view.transition_prev({
            "page": _page,
            "trans_page": _trans_page,
            "set_trans_page": function () {
                _var.learn_flashcard_transition = _var.learn_flashcard;
            },
            "set_page": function () {
                _var.learn_flashcard = _flashcard;
            },
            "animtation": "lift",
            "callback": _callback
        });
    };

    // 註冊
    var _status_key = "learn_flashcard_status";
    _status_init = function () {
        return $scope.db_status.add_listener(_status_key
                , function (_status) {
                    _ctl.status = _status;
                }
        , function () {
            return _status;
        });
    };
    _status_init();

    // --------------------------------------------------------

    /**
     * 偵測現在是否是history_stack的最後一個
     * @returns {Boolean}
     */
    _ctl.is_last_of_stack = function () {
        return (_status.history_index + 1 > _status.history_stack.length - 1);
    };

    _ctl.get_new_flashcard_type = function () {
        var _target = $scope.ctl_target.get_target_data("learn_flashcard");
        var _add_proportion = (_target.target - _target.done);
        if (_add_proportion < 0) {
            _add_proportion = 0;
        }

        var _review_proportion = _status.review_stack.length;

        $.console_trace([_target, _add_probability, _review_proportion]);
        $.console_trace($scope.ctl_target.status);
        if ((_add_probability + _review_proportion) === 0) {
            return "new";
        }

        var _add_probability = _add_proportion / (_add_proportion + _review_proportion);

        if (Math.random() < _add_probability) {
            return "new";
        }
        else {
            return "review";
        }
    };

    /**
     * @param {function} _callback = function(_item) {
     *      _item.q
     *      _item.a
     * }
     */
    _ctl.add_new_flashcard = function (_callback) {
        // 更新status
        _status.flashcard_index++;
        var _id = _status.flashcard_index;
        _ctl.set_flashcard(_id, function (_row) {
            if (_row === undefined) {
                // 表示已經到了最後一列
                _status.flashcard_index = 0;
                _ctl.add_new_flashcard(_callback);
            }
            else {
                // 完成新增
                $scope.ctl_target.done_plus("learnflashcard");
                
                $.trigger_callback(_callback, _row);
            }
        });
    };

    _ctl.add_review_flashcard = function (_callback) {
        // 隨機從陣列中取出資料，並且移除該資料
        var _exclude_id = _ctl.get_current_flashcard_id();
        var _index = $.array_random_splice(_status.review_stack, _exclude_id);
        _ctl.set_flashcard(_index, _callback);
    };

    _ctl.set_flashcard = function (_id, _callback) {
        var _sql = "SELECT * FROM flashcard WHERE id = " + _id;
        $scope.DB.exec(_sql, function (_data) {
            var _flashcard;
            if (_data.length > 0) {
                //_var.learn_flashcard.q = _data[0].q;
                //_var.learn_flashcard.a = _data[0].a;
                //_var.learn_flashcard.note = _data[0].note;
                _flashcard = _data[0];
            }
            $.trigger_callback(_callback, _flashcard);
        });
    };

    _ctl.set_history_flashcard = function (_callback) {
        var _id = _ctl.get_current_flashcard_id();
        return _ctl.set_flashcard(_id, _callback);
    };

    _ctl.get_current_flashcard_id = function () {
        return _status.history_stack[_status.history_index];
    };

    $scope.ctl_learn_flashcard = _ctl;
};