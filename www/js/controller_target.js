var controller_target = function ($scope) {
    
    /**
     * 重新計算的偏差值，單位是小時
     * 
     * 如果是偏差8小時，意思是每天早上8點重新計算
     * @type Number
     */
    var _target_offset_hours = 8;
    
    // 目標的類型，可以修改
    $scope.target_setting = {
        "learn": {
            "done": 0,
            "set": 30,
            "lang": {
                "title": "學習單字",
                "help": "設定每天目標學習的單字數量。"
            }
        },
        " note": {
            "done": 0,
            "set": 20,
            "lang": {
                "title": "撰寫筆記",
                "help": "設定每天要撰寫的筆記數量。針對不同單字，寫下你對不同單字的筆記與想法。字數及內容不拘，可隨意發揮。"
            }
        },
        "test": {
            "done": 0,
            "set": 30,
            "lang": {
                "title": "答對測驗",
                "help": "設定每天目標答對的題目數量。題目都是三選一的選擇題"
            }
        }
    };
    
    // --------------------------
    
    $scope.ctl_target = {
        enter_from_profile: function () {
            $scope.ctl_target.target_exists(function (_exists) {
                var _page = "target_view.html";
                if (_exists === false) {
                    _page = "target_set.html";
                }
                app.navi.replacePage(_page);
            });
        },
        /**
         * 未完成
         * @TODO #
         * @param {type} _callback
         * @returns {undefined}
         */
        target_exists: function (_callback) {
            var _exists = false;
            $.trigger_callback(_callback, _exists);
        },
        get_set_title: function () {
            var _date = new Date(new Date().getTime() - _target_offset_hours * 60 * 60 * 1000);
            var _month = _date.getMonth() + 1;
            var _day = _date.getDate();
            var _title = "設定" + _month + "月" + _day + "日目標";
            return _title;
        }
    };
};