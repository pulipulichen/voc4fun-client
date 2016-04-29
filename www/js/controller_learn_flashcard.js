var controller_learn_flashcard = function ($scope) {

    // ------------------------------

    var _ctl = {};

    var _log_file = "controller_learn_flashcard.js";

    //var _server_url = $scope.CONFIG.server_url;

    // ------------------------------

    var _var = {};

    _var.learn_flashcard = {
        q: "",
        a: "",
        note: "",
        other_note: [],
        other_note_loaded: false
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

    _var._other_note_mock = [
        {
            "uuid": 1,
            "name": "同學A",
            "note": "心得A\n\n\n\n\n\n心得心得"
        },
        {
            "uuid": 2,
            "name": "同學B",
            "note": "心得B\n\n\n\n\n\n心得心得"
        },
        {
            "uuid": 3,
            "name": "同學C",
            "note": "心得C\n\n\n\n\n\n心得心得"
        }
    ];

    _ctl.var = _var;

    // ----------------------------------------------

    var _status = {
        /**
         * 給上一頁下一頁瀏覽記錄用的
         */
        history_stack: [],
        /**
         * 已經學習過的單字
         */
        learned_stack: [],
        /**
         * 歷史記錄的索引
         */
        history_index: -1,
        /**
         * 查詢單字卡用的索引
         */
        flashcard_index: -1,
        /**
         * 需要複習的單字卡索引，保存的是ID喔
         */
        review_stack: []
    };

    _ctl.status = _status;

    // -----------------------------------------

    _ctl.enter = function (_do_animation) {
        // 讓選單保持在選取的狀態
        $scope.ons_view.active_menu(1);

        _ctl.init(function () {
            //$.console_trace("enter");

            if (_do_animation === false) {
                app.navi.replacePage("learn_flashcard.html", {
                    "animation": "none"
                });
            }
            else {
                app.navi.replacePage("learn_flashcard.html");
            }
        });
    };

    _ctl.init = function (_callback) {
        var _qualifier;
        if (_status.history_stack.length > 0) {
            if (_status.history_index < 0) {
                _status.history_index = 0;
            }
            //$.console_trace("init get from history");
            _qualifier = "history";
            _ctl.set_history_flashcard(function (_flashcard) {
                _var.learn_flashcard = _flashcard;
                $.trigger_callback(_callback);
            });
            _ctl.other_note_ajax();
        }
        else {
            _qualifier = "next";
            _ctl.next(_callback, false);
        }

        $scope.log(_log_file, "init()", _qualifier, _status);
    };

    _ctl.next = function (_callback, _do_animation) {
        //var _flashcard = _var._learn_flashcard_mock_b;
        var _qualifier;

        _ctl.other_note_reset();
        var _log = function (_flashcard) {
            $scope.log(_log_file, "next()", _qualifier, {
                flashcard_q: _flashcard.q,
                flashcard_index: _status.flashcard_index,
                history_index: _status.history_index
            });
            $scope.db_status.save_status(_status_key);
            _ctl.other_note_ajax();
        };

        var _trans_callback = function (_flashcard) {
            if (_do_animation === undefined || _do_animation !== false) {
                _log(_flashcard);
                _ctl._transition_next(_flashcard, _callback);
            }
            else {
                _var.learn_flashcard = _flashcard;
                _log(_flashcard);
                $.trigger_callback(_callback);
            }
        };

        if (_ctl.is_last_of_stack() === true) {
            var _push_history_stack = function (_flashcard) {
                _status.history_stack.push(_flashcard.id);
                _status.history_index++;
                //$.trigger_callback(_callback);

                $scope.ctl_test_select.add_test_stack(_flashcard.id);

                // 如果是新單字，則加入learned_stack中
                if ($.inArray(_flashcard.id, _status.learned_stack) === -1) {
                    _status.learned_stack.push(_flashcard.id);

                    // 完成新增
                    $scope.ctl_target.done_plus("learn_flashcard");
                }

                setTimeout(function () {
                    $scope.$digest();
                }, 0);
                
                _trans_callback(_flashcard);
            };

            if (_ctl.get_new_flashcard_type() === "new") {
                _qualifier = "new";
                _ctl.add_new_flashcard(_push_history_stack);
            }
            else {
                _qualifier = "review";
                _ctl.add_review_flashcard(_push_history_stack);
            }
        }
        else {
            //$.console_trace("不是最後一個的情況")
            _qualifier = "history";
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

    // -----------------------------

    _ctl.prev = function (_callback) {

        _ctl.other_note_reset();
        var _log = function (_flashcard) {
            $scope.log(_log_file, "prev()", undefined, {
                flashcard_q: _flashcard.q,
                flashcard_index: _status.flashcard_index,
                history_index: _status.history_index
            });
            $scope.db_status.save_status(_status_key);
            _ctl.other_note_ajax();
        };

        //var _flashcard = _var._learn_flashcard_mock_a;
        _status.history_index--;
        //$.console_trace(_status.history_index);
        _ctl.set_history_flashcard(function (_flashcard) {
            _ctl._transition_prev(_flashcard, function () {
                _log(_flashcard);
                $.trigger_callback(_callback);
            });
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
                //$.console_trace("_transition_prev 設定完了");
            },
            "animtation": "lift",
            "callback": _callback
        });
    };

    // 註冊
    var _status_key = "learn_flashcard";
    _status_init = function () {
        return $scope.db_status.add_listener(
                _status_key,
                function (_s) {
                    //$.clone_json(_ctl.status, _s);
                    _ctl.status = _s;
                    _status = _s;
                },
                function () {
                    _ctl.clean_history_stack();
                    return _status;
                });
    };
    _status_init();

    var _max_history_stack_length = $scope.CONFIG.max_history_stack_length;
    _ctl.clean_history_stack = function () {
        if (_status.history_stack.length > _max_history_stack_length) {
            var _stk = [];
            for (var _h = _status.history_stack.length - _max_history_stack_length; _h < _status.history_stack.length; _h++) {
                _stk.push(_status.history_stack[_h]);
            }
            _status.history_stack = _stk;
            _status.history_index = _stk.length - 1;
        }
    };

    // --------------------------------------------------------

    /**
     * 偵測現在是否是history_stack的最後一個
     * @returns {Boolean}
     */
    _ctl.is_last_of_stack = function () {
        return (_status.history_index + 1 > _status.history_stack.length - 1);
    };

    _ctl.get_new_flashcard_type = function () {
        //$.console_trace($scope.ctl_target.status);
        var _target = $scope.ctl_target.get_target_data("learn_flashcard");
        var _add_proportion = (_target.target - _target.done);
        if (_add_proportion < 0) {
            _add_proportion = 0;
        }

        // 排除掉現在的卡片
        var _review_stack = [];
        var _current_flashcard_id = _ctl.get_current_flashcard_id();
        for (var _i in _status.review_stack) {
            if (_status.review_stack[_i] !== _current_flashcard_id) {
                _review_stack.push(_status.review_stack[_i]);
            }
        }
        var _review_proportion = _review_stack.length;

        //$.console_trace([_target, _add_proportion, _review_proportion]);

        if ((_add_proportion + _review_proportion) === 0) {
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
        while (_status.flashcard_index === _ctl.get_current_flashcard_id()) {
            _status.flashcard_index++;
        }
        var _id = _status.flashcard_index;

        // 如果跟現在的id相同，則繼續下一個
        
        //_id++;
        //$.console_trace(typeof(_id), _id);

//        $scope.ctl_flashcard.get_flashcard(_id, function (_flashcard) {
//            //$.console_trace("test");
//            if (_flashcard === undefined) {
//                // 表示已經到了最後一列
//                _status.flashcard_index = 0;
//                _ctl.add_new_flashcard(_callback);
//            }
//            else {
//                $.trigger_callback(_callback, _flashcard);
//            }
//        });
        
        var _flashcard = $scope.ctl_flashcard.get_flashcard(_id);
            if (_flashcard === undefined) {
                // 表示已經到了最後一列
                _status.flashcard_index = -1;
                _ctl.add_new_flashcard(_callback);
            }
            else {
                $.trigger_callback(_callback, _flashcard);
            }
    };

    _ctl.add_review_flashcard = function (_callback) {
        // 隨機從陣列中取出資料，並且移除該資料
        var _exclude_id = _ctl.get_current_flashcard_id();
        var _index = $.array_random_splice(_status.review_stack, _exclude_id);
        //_status.review_stack = $.array_slice_element(_status.review_stack, _exclude_id);
        _ctl.remove_from_review_stack(_exclude_id);
        $scope.ctl_flashcard.get_flashcard(_index, _callback);
    };

//    _ctl.set_flashcard = function (_id, _callback) {
//        var _sql = "SELECT * FROM flashcard WHERE id = " + _id;
//        $scope.DB.exec(_sql, function (_data) {
//            var _flashcard;
//            if (_data.length > 0) {
//                //_var.learn_flashcard.q = _data[0].q;
//                //_var.learn_flashcard.a = _data[0].a;
//                //_var.learn_flashcard.note = _data[0].note;
//                _flashcard = _data[0];
//            }
//            $.trigger_callback(_callback, _flashcard);
//        });
//    };

    _ctl.set_history_flashcard = function (_callback) {
        var _id = _ctl.get_current_flashcard_id();
//        return $scope.ctl_flashcard.get_flashcard(_id, function (_flashcard) {
//            if (_flashcard !== undefined) {
//                _var.learn_flashcard.q = _flashcard.q;
//                _var.learn_flashcard.a = _flashcard.a;
//                _var.learn_flashcard.note = _flashcard.note;
//            }
//            $.trigger_callback(_callback, _flashcard);
//        });
        _ctl.remove_from_review_stack(_id);
        return $scope.ctl_flashcard.get_flashcard(_id, _callback);
    };

    _ctl.get_current_flashcard_id = function () {
        return _status.history_stack[_status.history_index];
    };

    // --------------------------------------------------

    _ctl.other_note_ajax = function (_callback) {
        //$.console_trace("other_note_ajax()", typeof(_var.learn_flashcard.q));
        if (typeof(_var.learn_flashcard.q) !== "string") {
            return;
        }
        
        //var _id = _ctl.get_current_flashcard_id();

        

        if (typeof($scope.CONFIG.server_url) === "string") {
            var _url = $scope.CONFIG.server_url + "model/note.php";
            setTimeout(function () {
                
                var _data = {
                    q: _var.learn_flashcard.q
                            //uuid: $scope.ctl_profile.get_uuid()
                };
                
                //$.console_trace("現在有筆記嗎？", _var.learn_flashcard.note);
                var _check_my_note = true;
                if (typeof (_var.learn_flashcard.note) === "string" && $.trim(_var.learn_flashcard.note) !== "") {
                    //$.console_trace("有資料", [typeof (_var.learn_flashcard.note), _var.learn_flashcard.note]);
                    //_ctl.var.learn_flashcard.note = "測試看看如何？還是不能用";
                    //alert(["有資料1", _ctl.var.learn_flashcard.note]);
                    _data.uuid = $scope.ctl_profile.get_uuid();
                    _check_my_note = false;
                }
                else {
                    //$.console_trace("沒有資料", [typeof (_var.learn_flashcard.note), _var.learn_flashcard.note]);
                }
                
                if (typeof(_data.q) !== "string" || _data.q === "") {
                    _ctl.other_note_ajax(_callback);
                    return;
                }
                
                $.getJSON(_url, _data, function (_other_note) {
                    _ctl.set_other_note(_other_note, _check_my_note, _callback);
                });
            }, 1000);
        }
            

//        setTimeout(function () {
//            _var.learn_flashcard.other_note = _var._other_note_mock;
//
//            var _notification = $(".learn-flashcard-page .notification")
//            _notification.find(".load-icon").hide();
//            _notification.find(".notification-text .count").text(_var.learn_flashcard.other_note.length);
//            _notification.find(".notification-text").show();
//            //_var.learn_flashcard.other_note_loaded = true;
//            //$scope.$digest();
//            $scope.$digest();
//            $.console_trace("other_note_ajax 尚未完成");
//            $.trigger_callback(_callback);
//        }, 1000);
    };  //_ctl.other_note_ajax = function (_callback) {
    
    _ctl.set_other_note = function (_notes, _check_my_note, _callback) {
        if (typeof(_notes) === "object" && typeof(_notes.name) === "string") {
            _notes = [_notes];
        }
        //alert(["有資料1.1", _var.learn_flashcard.note]);

        var _other_note = [];
        if (_check_my_note === true) {
            // 先檢查note中是否有自己的
            var _uuid = $scope.ctl_profile.get_uuid();
            for (var _i = 0; _i < _notes.length; _i++) {
                var _note = _notes[_i];
                //$.console_trace([_note.uuid, _uuid]);
                if (_note.uuid !== _uuid) {
                    _other_note.push(_note);
                }
                else {
                    // 加入筆記功能中
                    //$.console_trace("抓到自己的資料了", _note);
                    var _flashcard_id = _ctl.get_current_flashcard_id();
                    $scope.ctl_note.check_note_edited(_flashcard_id);
                    $scope.ctl_note.save_note_to_db(_note.note);
                    // take_note加一
                }
            }
        }
        else {
            //alert(["有資料1.2", _var.learn_flashcard.note]);
            _other_note = _notes;
        }

        //$.console_trace(_other_note);
        _var.learn_flashcard.other_note = _other_note;
        //alert(["有資料2", _var.learn_flashcard.note]);

        var _notification = $(".learn-flashcard-page .notification");
        _notification.find(".load-icon").hide();
        _notification.find(".notification-text .count").text(_var.learn_flashcard.other_note.length);
        _notification.find(".notification-text").show();
        //_var.learn_flashcard.other_note_loaded = true;
        //$scope.$digest();
        $scope.$digest();
        //$.console_trace("other_note_ajax 尚未完成");
        $.trigger_callback(_callback);
    };

    _ctl.other_note_reset = function () {
        var _notification = $(".learn-flashcard-page .notification");
        _notification.find(".load-icon").show();
        _notification.find(".notification-text").hide();
    };

    // ---------------------------------

    _var.more_menu;
    var _more_menu_html = "learn_flashcard_more.html";
    _ctl.open_more_menu = function (_event) {
        if (_var.more_menu === undefined) {
            ons.createPopover(_more_menu_html).then(function (popover) {
                _var.more_menu = popover;
                _var.more_menu.show(_event);
            });
        }
        else {
            _var.more_menu.show(_event);
        }
        return this;
    };

    // ---------------------------------

    _ctl.get_learned_count = function () {
        if (typeof (_status.learned_stack) === "undefined") {
            return 0;
        }
        return _status.learned_stack.length;
    };

    _ctl.add_incorrect_answer_to_review_stack = function (_flashcard_id) {
        _status.review_stack.push(_flashcard_id);
        $scope.db_status.save_status(_status_key);
    };

    _ctl.remove_from_review_stack = function (_flashcard_id) {
        if ($.inArray(_flashcard_id, _status.review_stack)) {
            // 如果是在複習名單裡面
            _status.review_stack = $.array_slice_element(_flashcard_id, _status.review_stack);
            $scope.ctl_test_select.add_test_stack(_flashcard_id);
        }
        $scope.db_status.save_status(_status_key);
    };

    // ---------------------------------

    $scope.ctl_learn_flashcard = _ctl;
};