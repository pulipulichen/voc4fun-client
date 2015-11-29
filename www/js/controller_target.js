/*global ons:false */
/*global app:false */
/*global target_help_modal:false */
/**
 * 目標的相關控制器
 * @param {Object} $scope Angular.js的$scope
 * @returns {controller_target}
 */
var controller_target = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_target.js";

    // ---------------------------

    var _var = {};

    // 目標的類型，可以修改
    _var.target_setting = [
        {
            "key": "learn_flashcard",
            //"default_target": 30,
            "default_target": 3,
            "min": 0,
            "default_max": 100,
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
            "default_max": 100,
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
            "default_max": 100,
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
     * @param {boolean} _animation 是否要動畫
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
                // 有今天資料的情況
                var _page = "target_view.html";
                if (_today_exists === false) {
                    _ctl._init_target_data();
                    if (_yesterday_exists === false) {
                        // 沒有今天，也沒有昨天資料的情況
                        _page = "target_init.html";
                    }
                    else {
                        // 沒有今天，有昨天資料的情況
                        _page = "target_recommend.html";
                    }
                }

                //$scope.target_data.learn_flashcard.done = 50;
                //$.console_trace(_animation);
                if (_page === "target_recommend.html") {
                    _ctl.add_target_history(_ctl.get_yesterday_target_data());
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

    _ctl.enter_from_menu = function () {
        app.navi.replacePage("target_view_page.html", {"animation": "none"});
    };

    // ---------------------------

    /**
     * 未完成
     * @TODO #
     * @param {number} _offset
     * @param {function} _callback
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

    _ctl._get_period_date = function (_day_offset) {
        if (_day_offset === undefined) {
            _day_offset = 0;
        }
        
        var _timestamp = new Date().getTime() - _target_offset_hours * 60 * 60 * 1000;
        _timestamp = _timestamp + _day_offset * 24 * 60 * 60 * 1000;
        var _date = new Date(_timestamp);
        var _year = _date.getFullYear();
        var _month = _date.getMonth() + 1;
        var _day = _date.getDate();
        return {
            year: _year,
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

    _ctl.get_menu_title = function () {
        var _date = _ctl._get_period_date();
        var _title = "您" + _date.month + "月" + _date.day + "日的進度是";
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

    _ctl.show_help = function (_key) {
        var _setting = $scope.ctl_target._get_setting(_key);
        _var.target_help.help_img = _setting.help_img;
        _var.target_help.help = _setting.help;

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
        else if (_target > _ctl.get_max_target(_key)) {
            _target = _ctl.get_max_target(_key);
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

    _ctl.done_plus = function (_key) {
        //$.console_trace("done_plus", _status);
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
                    message: _setting.complete_message,
                    callback: function () {
                        if (_ctl.get_complete_percent() === 100) {
                            _ctl.complate_all_target();
                        }
                    }
                });
            }, 500);
            $scope.log(_log_file, "complate_target", undefined, _status[_key]);
        }
    };

    _ctl.complate_all_target = function () {
        setTimeout(function () {
            ons.notification.alert({
                title: "太厲害了！",
                message: "您達成了全部的目標了！"
            });
        }, 500);
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

    // -----------------------------------------

    _ctl.get_complete_percent = function () {
        return _ctl._calc_complete_percent(_status);
    };
    
    _ctl._calc_complete_percent = function (_target_data) {
        var _done = 0;
        var _target = 0;
        var _percent;

        for (var _i in _status) {
            _done = _done + _target_data[_i].done;
            _target = _target + _target_data[_i].target;
        }

        //$.console_trace("get_complete_percent", {
        //    done: _done, target: _target, percent: Math.floor(_done / _target * 100)
        //});

        if (_target !== 0) {
            _percent = Math.floor(_done / _target * 100);
        }

        return _percent;
    };

    // ------------------------------------------

    _ctl.get_notification_message = function () {
        var _msg = "您的進度是" + _ctl.get_complete_percent() + "%";
        return _msg;
    };

    // ------------------------------------------

    _ctl.get_max_target = function (_key) {
        var _flashcard_count = $scope.ctl_flashcard.status.flashcard_count;
        _flashcard_count = _flashcard_count - _ctl.get_remained_target(_key);

        var _setting = _ctl._get_setting(_key);
        var _default_max = _setting.default_max;

        return Math.min(_flashcard_count, _default_max);
    };

    _ctl.get_remained_target = function (_key) {
        if (_key === "learn_flashcard") {
            return $scope.ctl_learn_flashcard.get_learned_count();
        }
        else if (_key === "take_note") {
            return $scope.ctl_note.get_noted_count();
        }
        else if (_key === "test_select") {
            return $scope.ctl_test_select.get_tested_count();
        }
        else {
            return 0;
        }
    };

    // ------------------------------------------
    // 推薦資料的計算
    // ----------------------------------------- 

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
        // @TODO target在隔日重新計算 #57
        //_var.recommend_target_data = _var._recommend_target_data_mock;



        _ctl.get_yesterday_target_data(function (_target) {
            _ctl.get_before_yesterday_target_data(function (_prev_target) {
                _ctl._calculate_recommend_target_data(_target, _prev_target, _callback);
            });
        });
    };

    _ctl_calculate_recommend_target_data = function (_target, _prev_target, _callback) {

        var _recommend_target_data = {};

        for (var _i in _target) {
            var _t = _target[_i];
            var _p = _prev_target[_i];
            _recommend_target_data[_i] = {
                last_done: _t.done,
                last_target: _t.target
            };

            var _recommend_target;

            if (_t.done < _t.target) {
                _recommend_target = Math.floor((_t.target - _t.done) / 2) + _t.done;
            }
            else if (_t.done > _t.target) {
                _recommend_target = _t.done;
            }
            else {
                if (_t.done === _p.done) {
                    // 今天做的量，跟昨天相同
                    if (_p.target > _p.done) {
                        _recommend_target = _p.done + Math.floor((_p.target - _p.done) / 2);
                    }
                    else {
                        // p.d = 10
                        // p.t = 6
                        // r = 12
                        _recommend_target = _p.done + Math.floor((_p.done - _p.target) / 2);
                    }
                }
                else if (_t.done < _p.done) {
                    _recommend_target = _p.done;
                }
                else {
                    _recommend_target = Math.max(_t.done, _p.target);
                }
            }

            _recommend_target_data[_i].recommend_target = Math.min(_recommend_target, _ctl.get_max_target(_i));
        }   //for (var _i in _target) {
        _var.recommend_target_data = _recommend_target_data;
        $.trigger_callback(_callback);
    };

    var _yesterday_target_data_mock = {
        "learn_flashcard": {
            done: 0,
            target: 30
        },
        "take_note": {
            done: 40,
            target: 30
        },
        "test_select": {
            done: 30,
            target: 30
        }
    };

    _ctl.get_yesterday_target_data = function (_callback) {
        $.trigger_callback(_callback, _yesterday_target_data_mock);
    };

    var _before_yesterday_target_data_mock = {
        "learn_flashcard": {
            done: 0,
            target: 30
        },
        "take_note": {
            done: 40,
            target: 30
        },
        "test_select": {
            done: 30,
            target: 40
        }
    };

    _ctl.get_before_yesterday_target_data = function (_callback) {
        $.trigger_callback(_callback, _before_yesterday_target_data_mock);
    };
    
    _ctl.add_target_history = function (_target_data) {
        var _date = _ctl._get_period_date(-1);  //取得昨天的期間
        var _complete_percent = _ctl._calc_complete_percent(_target_data);
        $scope.db_target_history.add(_date, _complete_percent, _target_data);
    };

    // ------------------------------------------

    $scope.ctl_target = _ctl;
};