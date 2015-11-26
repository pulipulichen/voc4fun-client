var controller_learn_flashcard = function ($scope) {
    
    // ------------------------------
    
    $scope.ctl_learn_flashcard = {};
    
    // ------------------------------
    
    $scope.ctl_learn_flashcard.var = {};
    
    $scope.ctl_learn_flashcard.var.learn_flashcard = {
        q: "English",
        a: "中文的說明",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
        other_note_count: 0,
        other_note: []
    };
    
    $scope.ctl_learn_flashcard.var.learn_flashcard_transition = {};
    
    $scope.ctl_learn_flashcard.var._learn_flashcard_mock_a = {
        q: "English A",
        a: "中文的說明 A",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
        other_note_count: 0,
        other_note: []
    };
    
    $scope.ctl_learn_flashcard.var._learn_flashcard_mock_b = {
        q: "English B",
        a: "中文的說明 B",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
        other_note_count: 0,
        other_note: []
    };
    
    $scope.ctl_learn_flashcard.status = {
        stack: [],
        index: 0,
        new_index: 0,
        max_index: 0
    };
    
    // -----------------------------------------
    
    $scope.ctl_learn_flashcard.enter = function () {
        $scope.ctl_learn_flashcard.init(function () {
            app.navi.replacePage("learn_flashcard.html");
        });
    };
     
    $scope.ctl_learn_flashcard.init = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_learn_flashcard.next = function (_callback) {
        $scope.ctl_learn_flashcard.var.learn_flashcard_transition = $scope.ctl_learn_flashcard.var._learn_flashcard_mock_b;
        
        app.navi.replacePage("learn_flashcard_transition.html", {
            "animation": "lift",
            "onTransitionEnd": function () {
                $scope.ctl_learn_flashcard.var.learn_flashcard = $scope.ctl_learn_flashcard.var._learn_flashcard_mock_b;
                app.navi.replacePage("learn_flashcard.html", {
                    "animation": "none",
                    "onTransitionEnd": _callback
                });
            }
        });
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_learn_flashcard.prev = function (_callback) {
        $scope.ctl_learn_flashcard.var.learn_flashcard_transition = $scope.ctl_learn_flashcard.var.learn_flashcard;
        
        app.navi.pushPage("learn_flashcard_transition.html", {
            "animation": "none",
            "onTransitionEnd": function () {
                $scope.ctl_learn_flashcard.var.learn_flashcard = $scope.ctl_learn_flashcard.var._learn_flashcard_mock_a;
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
    $scope.ctl_learn_flashcard.status_init = function () {
        return $scope.db_status.add_listener(_status_key
            , function (_status) {
                $scope.learn_flashcard_status = _status;
            }
            , function () {
                return $scope.learn_flashcard_status;
        });
    };
    $scope.ctl_target.status_init();
    
    // --------------------------------------------------------
    
    $scope.ctl_learn_flashcard.is_out_of_stack = function () {
        return ($scope.learn_flashcard_status.index > $scope.learn_flashcard_status.stack.length);
    };
    
    $scope.ctl_learn_flashcard.get_new_item_type = function () {
        var _review_threshold = 0.2;
        
        if ($scope.test_select_status.error_stack.length === 0) {
            return "new";
        }
        else {
            if (Math.random() > _review_threshold) {
                return "new";
            }
            else {
                return "review";
            }
        }
    };
    
    /**
     * @param {function} _callback = function(_item) {
     *      _item.q
     *      _item.a
     * }
     */
    $scope.ctl_learn_flashcard.add_new_item = function (_callback) {
        var _sql = "SELECT q, a FROM flashcard WHERE id = " + $scope.learn_flashcard_status.new_index;
        $scope.DB.exec(_sql, _callback);
    };
};