var controller_target = function ($scope) {

    var _ctl = {};

    // ---------------------------

    var _var = {};

    // 目標的類型，可以修改
    _var.target_setting = [
        {
            "key": "learn_flashcard",
            //"default_target": 30,
            "default_target": 3,
            "min": 0,
            "max": 100,
            "title": "學習單字",
            "help_img": "img/loading.svg",
            "help": "設定每天目標學習的單字數量。",
            "complete_message": "恭喜您完成了今日目標！"
        },
        {
            "key": "take_note",
            //"default_target": 20,
            "default_target": 2,
            "min": 0,
            "max": 100,
            "title": "撰寫筆記",
            "help_img": "img/loading.svg",
            "help": "設定每天要撰寫的筆記數量。\n針對不同單字，寫下你對不同單字的筆記與想法。\n字數及內容不拘，可隨意發揮。",
            "complete_message": "恭喜您完成了今日目標！"
        },
        {
            "key": "test_select",
            //"default_target": 30,
            "default_target": 3,
            "min": 0,
            "max": 100,
            "title": "答對測驗",
            "help_img": "img/loading.svg",
            "help": "設定每天目標答對的題目數量。\n題目都是三選一的選擇題。",
            "complete_message": "恭喜您完成了今日目標！"
        }
    ];


    _var.target_help = {
        help_img: "img/loading.svg",
        help: ""
    };
    
    _var.use_pop_page = false;

    _ctl.var = _var;

    // ----------------------------------

    var _status = {};

    _ctl.status = _status;

    var _status_key = "target";
    var _log_file = "controller_target.js";

    // -------------------------------------

    /**
     * 重新計算的偏差值，單位是小時
     * 
     * 如果是偏差8小時，意思是每天早上8點重新計算
     * @type Number
     */


//    $scope._target_data_mock = {
//        "learn": {
//            done: 0,
//            target: 30
//            
//        }
//    };

    // --------------------------

    var _target_offset_hours = 8;

    _ctl._init_target_data = function () {
        for (var _i = 0; _i < _var.target_setting.length; _i++) {
            var _item = _var.target_setting[_i];
            var _key = _item.key;
            var _target = _item.default_target;
            _status[_key] = {
                "done": 0,
                "target": _target
            };
        }
    };

    /**
     * 
     * @param {boolean} _animate 是否要動畫
     */
    _ctl.enter_from_profile = function (_animation) {

        if (_animation === false) {
            _animation = {
                animation: "none"
            };
        }
        else {
            _animation = {
                animation: "slide"
            };
        }

        //$.console_trace("enter_from_profile", $scope.target_data);

        _ctl.period_target_exists(function (_today_exists) {
            _ctl.period_target_exists(-1, function (_yesterday_exists) {
                var _page = "target_view.html";
                if (_today_exists === false) {
                    _ctl._init_target_data();
                    if (_yesterday_exists === false) {
                        _page = "target_init.html";
                    }
                    else {
                        _page = "target_recommend.html";
                    }
                }

                //$scope.target_data.learn_flashcard.done = 50;
                //$.console_trace(_animation);
                if (_page === "target_recommend.html") {
                    _ctl.init_recommend_target_data(function () {
                        app.navi.replacePage(_page, _animation);
                    });
                }
                else {
                    app.navi.replacePage(_page, _animation);
                }
            });
        });
        return this;
    };
    
    _ctl.enter_for_view = function () {
        _var.use_pop_page = true;
        app.navi.pushPage("target_view.html");
    };
    
    _ctl.exit_from_view = function () {
        _var.use_pop_page = false;
        app.navi.popPage();
    };
    
    /**
     * 未完成
     * @TODO #
     * @param {type} _callback
     * @returns {undefined}
     */
    _ctl.period_target_exists = function (_offset, _callback) {

        if (typeof (_offset) === "function") {
            _callback = _offset;
            _offset = 0;
        }

        var _file_name = "controller_target.js";
        var _function_name = "$scope.ctl_target.set_target()";

        var _exists = true;
        $scope.db_log.get_latest_log({
            "file_name": _file_name,
            "function_name": _function_name,
            "min_timestamp": _ctl.get_period_start_timestamp(_offset),
            "max_timestamp": _ctl.get_period_end_timestamp(_offset),
            "callback": function (_data) {
                if (_data === undefined) {
                    _exists = false;
                }
                $.trigger_callback(_callback, _exists);
            }
        });

        return this;
    };

    /**
     * @param {Number} _offset 偏移天數
     * @returns {Number}
     */
    _ctl.get_period_start_timestamp = function (_offset) {
        var _timestamp = new Date().getTime() - _target_offset_hours * 60 * 60 * 1000;
        if (typeof (_offset) === "number") {
            _timestamp = _timestamp + _offset * 24 * 60 * 60 * 1000;
        }
        var _date = new Date(_timestamp);
        _date.setHours(_target_offset_hours);
        return _date.getTime();
    };

    /**
     * @param {Number} _offset 偏移天數
     * @returns {Number}
     */
    _ctl.get_period_end_timestamp = function (_offset) {
        var _timestamp = _ctl.get_period_start_timestamp(_offset);
        _timestamp = _timestamp + 24 * 60 * 60 * 1000;
        return _timestamp;
    };

    _ctl._get_period_date = function () {
        var _date = new Date(new Date().getTime() - _target_offset_hours * 60 * 60 * 1000);
        var _month = _date.getMonth() + 1;
        var _day = _date.getDate();
        return {
            month: _month,
            day: _day
        };
    };

    _ctl.get_set_title = function () {
        var _date = _ctl._get_period_date();
        var _title = "設定 " + _date.month + "月" + _date.day + "日 的目標";
        return _title;
    };

    _ctl.get_view_title = function () {
        var _date = _ctl._get_period_date();
        var _title = _date.month + "月" + _date.day + "日的目標與進度";
        return _title;
    };

    _ctl.set_target = function ($event) {
        var _form = $($event.target);
        var _log_data = {};
        for (var _key in _status) {
            var _target = _form.find('input[target_key="' + _key + '"]').val();
            _target = parseInt(_target, 10);
            _status[_key].target = _target;
            _log_data[_key] = _target;
        }

        $scope.log("controller_target.js", "$scope.ctl_target.set_target()", _log_data);
        //$.console_trace(_log_data);

        //$scope.ctl_activity.enter_from_target();

        // 把現在的狀態儲存進資料表中
        $scope.db_status.save_status(_status_key);
    };

    // 註冊
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
                });
    };
    _init_status();

    _ctl.show_help = function (_key) {
        var _setting = $scope.ctl_target._get_setting(_key);
        _var.help_img = _setting.help_img;
        _var.help = _setting.help;

        target_help_modal.show();
    };

    _ctl._get_setting = function (_key) {
        for (var _i = 0; _i < _var.target_setting.length; _i++) {
            var _setting = _var.target_setting[_i];
            if (_setting.key === _key) {
                return _setting;
            }
        }
    };

    _ctl.get_target = function (_key) {
        //$.console_trace(_key);
        var _setting = _ctl._get_setting(_key);
        var _target_data = _ctl.get_target_data(_key);
        var _target = _target_data.target;
        if (_target < _setting.min) {
            _target = _setting.min;
        }
        else if (_target > _setting.max) {
            _target = _setting.max;
        }
        return _target;
    };

    _ctl.change_target_number = function ($event, _interval) {
        if (typeof (_interval) !== "number") {
            _interval = 1;
        }

        var _input = $($event.target).parent().find("input");
        var _val = _input.val();
        _val = parseInt(_val, 10);
        _val = _val + _interval;

        var _min = _input.attr("min");
        var _max = _input.attr("max");

        if (!(_val < _min || _val > _max)) {
            _input.val(_val);
        }
        return this;
    };

    _var.recommend_target_data;

    _var._recommend_target_data_mock = {
        "learn_flashcard": {
            last_done: 12,
            last_target: 30,
            recommend_target: 31
        },
        "take_note": {
            last_done: 5,
            last_target: 20,
            recommend_target: 21
        },
        "test_select": {
            last_done: 7,
            last_target: 30,
            recommend_target: 27
        }
    };

    _ctl.init_recommend_target_data = function (_callback) {
        _var.recommend_target_data = _var._recommend_target_data_mock;
        $.trigger_callback(_callback);
    };

    _ctl.done_plus = function (_key) {
        $.console_trace("done_plus", _status);
        if (typeof (_status[_key]) === "object") {
            _status[_key].done++;
            $scope.log(_log_file, "done_plus", undefined, {
                key: _key,
                done: _status[_key].done
            });
            
            $scope.db_status.save_status(_status_key);

            _ctl.complate_target(_key);
        }
        return this;
    };

    _ctl.complate_target = function (_key) {
        if (_status[_key].done === _status[_key].target) {
            var _setting = _ctl._get_setting(_key);
            var _title = _setting.title + "已經完成";
            setTimeout(function () {
                ons.notification.alert({
                    title: _title,
                    message: _setting.complete_message
                });
            }, 500);
            $scope.log(_log_file, "complate_target", undefined, _status[_key]);
        }
    };

    _ctl.get_done = function (_key) {
        if (typeof (_status[_key]) === "object") {
            return _status[_key].done;
        }
        else {
            return 0;
        }
    };

    _ctl.get_target_data = function (_key) {
        //$.console_trace(typeof(_status[_key]), _key);
        if (typeof (_status[_key]) === "object") {
            return _status[_key];
        }
        else {
            // 如果沒有資料
            $.console_trace("Lost target status");
            //app.navi.replacePage("target_init.html");
            $scope.ctl_target.enter_from_profile(false);
        }
    };

    $scope.ctl_target = _ctl;
};