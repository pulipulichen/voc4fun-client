var controller_learn_flashcard = function ($scope) {
    
    // ------------------------------
    
    var _ctl = {};
    
    // ------------------------------
    
    var _var = {};
    
    _var.learn_flashcard = {
        q: "English",
        a: "中文的說明",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
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
        history_index: 0,
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
            app.navi.replacePage("learn_flashcard.html");
        });
    };
     
    _ctl.init = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    _ctl.next = function (_callback) {
        var _flashcard = _var._learn_flashcard_mock_b;
        _ctl._transition_next(_flashcard, _callback);
    };
    
    _ctl._transition_next = function (_flashcard, _callback) {
        _var.learn_flashcard_transition = _flashcard;
        
        app.navi.replacePage("learn_flashcard_transition.html", {
            "animation": "lift",
            "onTransitionEnd": function () {
                _var.learn_flashcard = _flashcard;
                app.navi.replacePage("learn_flashcard.html", {
                    "animation": "none",
                    "onTransitionEnd": _callback
                });
            }
        });
        $.trigger_callback(_callback);
    };
    
    _ctl.prev = function (_callback) {
        var _flashcard = _var._learn_flashcard_mock_a;
        _ctl._transition_prev(_flashcard, _callback);
    };
    
    _ctl._transition_prev = function (_flashcard, _callback) {
        _var.learn_flashcard_transition = _var.learn_flashcard;
        
        app.navi.pushPage("learn_flashcard_transition.html", {
            "animation": "none",
            "onTransitionEnd": function () {
                _var.learn_flashcard = _flashcard;
                $scope.$digest();
                app.navi.popPage({
                    "animation": "lift",
                    "onTransitionEnd": _callback
                });
            }
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
        return (_status.history_index > _status.history_stack.length - 1);
    };
    
    _ctl.get_new_flashcard_type = function () {
        var _add_proportion = ($scope.target_data.learn_flashcard.target - $scope.target_data.learn_flashcard.done);
        if (_add_proportion < 0) {
            _add_proportion = 0;
        }
        
        var _review_proportion = _status.review_stack.length;
        
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
    _ctl.add_new_item = function (_callback) {
        var _id = _status.flashcard_index;
        _ctl.get_flashcard(_id, function (_row) {
            if (_row.length === 0) {
                // 表示已經到了最後一列
                _status.flashcard_index = 0;
                _ctl.add_new_item(_callback);
            }
            else {
                $.trigger_callback(_callback, _row);
            }
        });
    };
    
    _ctl.get_review_item = function(_callback) {
        // 隨機從陣列中取出資料，並且移除該資料
        var _index = $.array_random_splice(_status.review_stack);
        _ctl.get_flashcard(_index, _callback);
    };
    
    _ctl.get_flashcard = function (_id, _callback) {
        var _sql = "SELECT q, a FROM flashcard WHERE id = " + _id;
        $scope.DB.exec(_sql, _callback);
    };
    
    $scope.ctl_learn_flashcard = _ctl;
};