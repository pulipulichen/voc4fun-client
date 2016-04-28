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
    //$.console_trace("controller_target", $scope.CONFIG.target_setting);
    _var.target_setting = $scope.CONFIG.target_setting;

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
                    //$.console_trace("呼叫target status");
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

    var _target_offset_hours = $scope.CONFIG.target_offset_hours;

    _ctl._init_target_data = function () {
        for (var _i = 0; _i < _var.target_setting.length; _i++) {
            var _item = _var.target_setting[_i];
            var _key = _item.key;
            var _target = _item.default_target;
            
            if (_target > $scope.ctl_flashcard.status.flashcard_count) {
                _target = $scope.ctl_flashcard.status.flashcard_count;
            }
            var _max = _ctl.get_max_target(_key);
            if (_target > _max) {
                _target = _max;
            }
            
            _status[_key] = {
                "done": 0,
                "target": _target
            };
            $scope.$digest();
            //$.console_trace(_i);
        }
        //$scope.$digest();
        return this;
    };

    _ctl.get_setting_target = function () {
        var _target = {};
        for (var _i = 0; _i < _var.target_setting.length; _i++) {
            var _item = _var.target_setting[_i];
            var _key = _item.key;
            var _target = _item.default_target;
            _target[_key] = _target;
        }
        return _target;
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
        
        if ($scope.CONFIG.control_group_version === true) {
            _status = _ctl.get_target_data_default();
            $scope.ctl_activity.enter_from_target();
            return this;
        }

        _ctl.period_target_exists(function (_today_exists) {
            _ctl.before_target_exists(-1, function (_yesterday_exists) {
                var _page = "target_view.html";
                //$.console_trace("exists", [_today_exists, _yesterday_exists]);
                if (_today_exists === false) {
                    //$.console_trace("今天沒有資料的情況", _yesterday_exists);
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
                //$.console_trace(_page, _animation);
                //$.console_trace("enter_from_profile()", _page);
                if (_page === "target_recommend.html") {

                    // 把昨天的資料加入
                    _ctl.get_yesterday_target_data(function (_target_data) {
                        //$.console_trace("!!", _target_data);
                        _ctl.add_target_history(_target_data);

                        _ctl.init_recommend_target_data(function () {
                            app.navi.replacePage(_page, _animation);
                        });
                    });
                }
                else {
                    //$.console_trace(_page, _animation);
                    app.navi.replacePage(_page, _animation);
                }
            });
        });
        return this;
    };

    _ctl.enter_for_view = function () {
        _var.use_pop_page = true;
        app.navi.pushPage("target_view.html");
        return this;
    };

    _ctl.exit_from_view = function () {
        _var.use_pop_page = false;
        app.navi.popPage();
        return this;
    };

    _ctl.enter_from_menu = function () {
        if ($scope.CONFIG.control_group_version === true) {
            return this;
        }
        app.navi.replacePage("target_view_page.html", {"animation": "none"});
        return this;
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

        var _function_name = "set_target()";

        var _exists = true;
        $scope.db_log.get_latest_log({
            "file_name": _log_file,
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
     * 未完成
     * @TODO #
     * @param {number} _offset
     * @param {function} _callback
     */
    _ctl.before_target_exists = function (_offset, _callback) {

        if (typeof (_offset) === "function") {
            _callback = _offset;
            _offset = 0;
        }

        var _function_name = "set_target()";

        var _exists = true;
        $scope.db_log.get_latest_log({
            "file_name": _log_file,
            "function_name": _function_name,
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
    _ctl.get_period_start_timestamp = function (_offset, _refer_timestamp) {
        if (typeof (_offset) !== "number") {
            _offset = 0;
        }
        //_offset = _offset + $scope.CONFIG.day_offset;

        var _timestamp = new Date().getTime();
        _timestamp = _timestamp + $scope.CONFIG.day_offset * 24 * 60 * 60 * 1000;
        if (_refer_timestamp !== undefined) {
            _timestamp = _refer_timestamp;
        }
        
        _timestamp = _timestamp - _target_offset_hours * 60 * 60 * 1000;
        _timestamp = _timestamp + _offset * 24 * 60 * 60 * 1000;

        var _date = new Date(_timestamp);
        _date.setHours(_target_offset_hours);
        _date.setMinutes(0);
        _date.setSeconds(0);
        return _date.getTime();
    };

    /**
     * @param {Number} _offset 偏移天數
     * @returns {Number}
     */
    _ctl.get_period_end_timestamp = function (_offset, _refer_timestamp) {
        var _timestamp = _ctl.get_period_start_timestamp(_offset, _refer_timestamp);
        _timestamp = _timestamp + 24 * 60 * 60 * 1000;
        return _timestamp;
    };

    _ctl._get_period_date = function (_day_offset, _refer_timestamp) {
        if (_day_offset === undefined) {
            _day_offset = 0;
        }

        _day_offset = _day_offset + $scope.CONFIG.day_offset;

        var _timestamp = _refer_timestamp;
        if (typeof (_timestamp) !== "number") {
            _timestamp = new Date().getTime();
        }

        _timestamp = _timestamp - _target_offset_hours * 60 * 60 * 1000;
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
        var _title = "設定 " + _date.month + "月" + _date.day + "日 的目標"; // @TODO 語系
        return _title;
    };

    _ctl.get_view_title = function () {
        var _date = _ctl._get_period_date();
        var _title = _date.month + "月" + _date.day + "日的目標與進度"; // @TODO 語系
        return _title;
    };

    _ctl.get_menu_title = function () {
        var _date = _ctl._get_period_date();
        var _title = "您" + _date.month + "月" + _date.day + "日的進度是";  // @TODO 語系
        return _title;
    };

    _ctl.set_target = function ($event) {
        var _form = $($event.target);
        var _log_data = {};
        for (var _key in _status) {
            var _target = _form.find('input[target_key="' + _key + '"]').val();
            _target = parseInt(_target, 10);
            
            // 如果超過某個數值，那就不採用了
            var _max = _ctl.get_max_target(_key);
            if (_target > _max) {
                _target = _max;
            }
            else if (_target < 1) {
                _target = 1;
            }
            else if (isNaN(_target)) {
                _target = _ctl.get_default_target(_key);
            }
            
            _status[_key].target = _target;
            _log_data[_key] = _target;
        }

        //$.console_trace("什麼時候寫進去的？", _status_key);
        $scope.log(_log_file, "set_target()", _log_data);
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

        $.console_trace("Cannot found setting: " + _key);
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
        else if (_val < _min) {
            _input.val(_min);
        }
        else {
            _input.val(_max);
        }
        return this;
    };

    _ctl.done_plus = function (_key) {
        //$.console_trace("done_plus", _status);
        if (typeof (_status[_key]) === "object") {
            _status[_key].done++;
            $scope.log(_log_file, "done_plus()", _key, {
                key: _key,
                done: _status[_key].done
            });

            $scope.db_status.save_status(_status_key);

            _ctl.complete_target(_key);
        }
        return this;
    };

    _ctl.complete_target = function (_key) {
        if (_status[_key].done === _status[_key].target) {
            var _setting = _ctl._get_setting(_key);
            var _title = _setting.title + "已經完成"; // @TODO 語系
            setTimeout(function () {
                if ($scope.CONFIG.control_group_version === false) {
                    ons.notification.alert({
                        title: _title,
                        message: _setting.complete_message,
                        callback: function () {
                            if (_ctl.get_complete_percent() === 100) {
                                _ctl.complete_all_target();
                            }
                        }
                    });
                }
            }, 500);
            $scope.log(_log_file, "complete_target()", _key, _status[_key]);
        }
    };

    _ctl.complete_all_target = function () {
        setTimeout(function () {
            if ($scope.CONFIG.control_group_version === false) {
                ons.notification.alert({
                    title: "太厲害了！", // @TODO 語系
                    message: "您達成了全部的目標了！" // @TODO 語系
                });
            }
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
        var _p = 0;
        var _target_count = 0;

        for (var _i in _status) {
            _done = _done + _target_data[_i].done;
            _target = _target + _target_data[_i].target;
            _p = _p + Math.min(100, Math.floor(_target_data[_i].done / _target_data[_i].target * 100));
            _target_count++;
        }

        _p = Math.floor(_p / _target_count);

        //$.console_trace("get_complete_percent", {
        //    done: _done, target: _target, percent: Math.floor(_done / _target * 100)
        //});

        if (_target !== 0) {
            if (_p < 100) {
                _percent = _p;
            }
            else {
                _percent = Math.floor(_done / _target * 100);
            }
        }
        
        if (_percent > 100) {
            _percent = 100;
        }

        return _percent;
    };

    // ------------------------------------------

    _ctl.get_notification_message = function () {
        // @TODO 語系
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

        //$.console_trace("init_recommend_target_data");
//        _ctl.get_yesterday_target_data(function (_target) {
//            _ctl.get_before_yesterday_target_data(function (_prev_target) {
//                //console.log(5+5);
//                _ctl._calculate_recommend_target_data(_target, _prev_target, _callback);
//            });
//        });

//        var _time1 = _ctl.get_period_start_timestamp(0);
//        $.console_trace("time1", _time1);
//        var _time2 = _ctl.get_period_start_timestamp(-1, _time1 - 1);
//        $.console_trace("time2", _time2);

        _ctl._get_prev_target_data_set(function (_prev_target_data_set) {
            _ctl._calculate_recommend_target_data(_prev_target_data_set, _callback);
        });
    };

    _ctl._get_prev_target_data_set = function (_callback) {
        //$.console_trace("_get_prev_target_data_set()");
        var _prev_target_data_set = [];

        //var _max_timestamp = _ctl.get_period_end_timestamp(-1, _refer_timestamp);
        _ctl.get_before_target_data(-1, function (_prev1) {
            if (_prev1 !== undefined) {
                _prev_target_data_set.push(_prev1[0]);
                var _refer_timestamp = _prev1[1];
                //$.console_trace("refer", _refer_timestamp);
                _ctl.get_before_target_data(-1, _refer_timestamp, function (_prev2) {
                    if (_prev2 !== undefined) {
                        //$.console_trace("prev2");
                        _prev_target_data_set.push(_prev2[0]);
                    }
                    $.trigger_callback(_callback, _prev_target_data_set);
                });
            }
            else {
                $.trigger_callback(_callback, _prev_target_data_set);
            }
        });

        //$.console_trace("_get_prev_target_data_set", _max_timestamp);
        //var _sql = "SELECT timestamp, data FROM log " 
        //        + "WHERE file_name = '" + _log_file + "' AND function_name = 'set_target()' "
        //        + " AND timestamp < " + _max_timestamp + " LIMIT 1";
        //
        //$scope.DB.exec(_sql, function (_row) {
        //    if (_row.length > 0) {
        //        _prev_target_data_set.push(JSON.parse(_row[0].data));
        //    }
        //    $.console_trace(_prev_target_data_set);
        $.trigger_callback(_callback, _prev_target_data_set);
        //});

    };

    /**
     * 推薦目標數量的演算法
     * @param {type} _target
     * @param {type} _prev_target
     * @param {type} _callback
     */
    _ctl._calculate_recommend_target_data = function (_prev_target_data_set, _callback) {

        var _recommend_target_data = {};

        var _target = undefined;
        var _prev_target = undefined;
        if (typeof (_prev_target_data_set[0]) === "object") {
            _target = _prev_target_data_set[0];
        }
        if (typeof (_prev_target_data_set[1]) === "object") {
            _prev_target = _prev_target_data_set[1];
        }

        $.console_trace("_prev_target_data_set", _prev_target_data_set.length);

        if (_target !== undefined && _prev_target !== undefined) {
            for (var _i in _target) {
                var _t = _target[_i];
                var _p = _prev_target[_i];

                //----------------------
                _recommend_target_data[_i] = {
                    last_done: _t.done,
                    last_target: _t.target
                };

                var _recommend_target;

                if (_t.done < _t.target) {
                    // 昨天未完成目標
                    _recommend_target = Math.floor((_t.target - _t.done) / 2) + _t.done;
                }
                else if (_t.done > _t.target) {
                    // 昨天超過目標的情況
                    _recommend_target = _t.done;
                }
                else {
                    // 昨天剛好達成目標

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
        }   //if (_target !== undefined && _prev_target !== undefined) {
        else if (_target !== undefined && _prev_target === undefined) {
            for (var _i in _target) {
                var _t = _target[_i];

                //----------------------
                _recommend_target_data[_i] = {
                    last_done: _t.done,
                    last_target: _t.target
                };

                var _recommend_target;

                if (_t.done < _t.target) {
                    // 昨天未完成目標
                    _recommend_target = Math.floor((_t.target - _t.done) / 2) + _t.done;
                }
                else if (_t.done > _t.target) {
                    // 昨天超過目標的情況
                    _recommend_target = _t.done;
                }
                else {
                    _recommend_target = _t.target + 1;
                }

                _recommend_target_data[_i].recommend_target = Math.min(_recommend_target, _ctl.get_max_target(_i));
            }   //for (var _i in _target) {
        }   //if (_target !== undefined && _prev_target !== undefined) {
        else {
            var _setting_target = _ctl.get_setting_target();
            for (var _i in _setting_target) {
                _recommend_target_data[_i].recommend_target = _setting_target[_i];
            }
        }

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
        // 先取得開始與結束時間點
        //$.trigger_callback(_callback, _yesterday_target_data_mock);
        //$.console_trace("get_yesterday_target_data()");
        //return _ctl.get_period_target_data(-1, _callback);
        return _ctl.get_before_target_data(-1, function (_data) {
            if (_data !== undefined) {
                _data = _data[0];
            }
            $.trigger_callback(_callback, _data);
        });
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

    _ctl.get_target_data_default = function () {
        var _target_data = {};
        for (var _i = 0; _i < _var.target_setting.length; _i++) {
            var _item = _var.target_setting[_i];
            var _key = _item.key;
            var _target = _item.default_target;
            _target_data[_key] = {
                "done": 0,
                "target": _target
            };
        }

        //$.console_trace("get_target_data_default()", _target_data);
        return _target_data;
    };
    
    _ctl.get_default_target = function (_key) {
        for (var _i = 0; _i < _var.target_setting.length; _i++) {
            var _item = _var.target_setting[_i];
            if (_key === _item.key) {
                return _item.default_target;
            }
        }
        return;
    };

    _ctl.get_before_yesterday_target_data = function (_callback) {
        //$.trigger_callback(_callback, _before_yesterday_target_data_mock);
        return _ctl.get_period_target_data(-2, _callback);
    };

    _ctl.get_period_target_data = function (_offset_day, _callback) {
        var _min_timestamp = _ctl.get_period_start_timestamp(_offset_day);
        var _max_timestamp = _ctl.get_period_end_timestamp(_offset_day);

        //var _target_data = {};
        //$.console_trace("_get_target_data_callback()", _target_data);
        var _get_target_data_callback = function (_data) {
            //if (_data === undefined) {
            //    $.trigger_callback(_callback);
            //    return;
            //}

            var _default_target_data = _ctl.get_target_data_default();
            if (_data === undefined) {
                _data = _default_target_data;
            }

            var _target_data = {};
            for (var _key in _data) {
                _target_data[_key] = {
                    done: 0,
                    target: _data[_key].target
                };
            }
            //$.console_trace("_target_data", _target_data);

            // 一個一個查詢大家的log
            var _ary_keys = $.array_keys(_target_data);

            var _loop = function (_i) {
                if (_i < _ary_keys.length) {
                    var _key = _ary_keys[_i];
                    $scope.db_log.get_latest_log({
                        file_name: _log_file,
                        function_name: "done()",
                        min_timestamp: _min_timestamp,
                        max_timestamp: _max_timestamp,
                        qualifier: _key,
                        callback: function (_data) {
                            if (_data !== undefined) {
                                _target_data[_key].done = _data.done;
                            }
                            else {
                                _target_data[_key] = _default_target_data[_key];
                            }
                            _i++;
                            _loop(_i);
                        }
                    });
                }
                else {
                    //$.console_trace("_get_target_data_callback()", _target_data);
                    $.trigger_callback(_callback, _target_data);
                }
            };
            _loop(0);
        };

        // 先取得target的部分
        //$.console_trace("$scope.db_log.get_latest_log({");
        $scope.db_log.get_latest_log({
            file_name: _log_file,
            function_name: "set_target()",
            min_timestamp: _min_timestamp,
            max_timestamp: _max_timestamp,
            callback: _get_target_data_callback
        });
    };

    _ctl.get_before_target_data = function (_offset_day, _refer_timestamp, _callback) {
        if (typeof (_refer_timestamp) === "function") {
            _callback = _refer_timestamp;
            _refer_timestamp = undefined;
        }

        var _max_timestamp = _ctl.get_period_end_timestamp(_offset_day, _refer_timestamp);
        //$.console_trace("_max_timestamp", _max_timestamp);

        //var _target_data = {};
        //$.console_trace("_get_target_data_callback()", _target_data);
        var _get_target_data_callback = function (_data) {
            if (_data === undefined) {
                $.trigger_callback(_callback);
                return;
            }

            //$.console_trace(_data);
            var _target_data = {};
            for (var _key in _data) {
                if (_key === "_timestamp") {
                    continue;
                }
                _target_data[_key] = {
                    done: 0,
                    target: _data[_key]
                };
            }
            //$.console_trace(_target_data);


            //_target_data._timestamp = _data._timestamp;

            //$.console_trace("_target_data", _target_data);

            // 一個一個查詢大家的log
            var _ary_keys = $.array_keys(_target_data);
            //$.console_trace(_ary_keys);

            var _loop = function (_i) {
                if (_i < _ary_keys.length) {
                    var _key = _ary_keys[_i];
                    $scope.db_log.get_latest_log({
                        file_name: _log_file,
                        function_name: "done_plus()",
                        max_timestamp: _max_timestamp,
                        qualifier: _key,
                        callback: function (_data) {
                            if (_data !== undefined) {
                                _target_data[_key].done = _data.done;
                            }
                            else {
                                _target_data[_key].done = 0;
                            }
                            _i++;
                            _loop(_i);
                        }
                    });
                }
                else {
                    $.console_trace("_get_target_data_callback()", _target_data);
                    $.trigger_callback(_callback, [_target_data, _data._timestamp]);
                }
            };
            _loop(0);
        };

        // 先取得target的部分
        //$.console_trace("$scope.db_log.get_latest_log({");
        $scope.db_log.get_latest_log({
            file_name: _log_file,
            function_name: "set_target()",
            max_timestamp: _max_timestamp,
            return_timestamp: true,
            callback: _get_target_data_callback
        });
    };

    // ------------------------------------------

    _ctl.add_target_history = function (_target_data) {
        var _date = _ctl._get_period_date(-1);  //取得昨天的期間
        var _complete_percent = _ctl._calc_complete_percent(_target_data);
        $scope.ctl_target_history.add(_date, _complete_percent, _target_data);
    };

    _ctl.is_target_setted = function () {
        var _target = 0;
        for (var _i in _status) {
            _target = _target + _status[_i].target;
        }
        return (_target > 0);
    };
    
    // -----------------------------------------------------------------
    
    _ctl.display_target = function (_target) {
        if (_target > 0) {
            return _target;
        }
        else {
            return "完成";  // @TODO 語系
        }
    };

    // ------------------------------------------

    $scope.ctl_target = _ctl;
};