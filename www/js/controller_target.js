var controller_target = function ($scope) {
    
    var _status_key = "target";

    /**
     * 重新計算的偏差值，單位是小時
     * 
     * 如果是偏差8小時，意思是每天早上8點重新計算
     * @type Number
     */
    var _target_offset_hours = 8;

    // 目標的類型，可以修改
    $scope.target_setting = [
        {
            "key": "learn",
            "default_target": 30,
            "min": 0,
            "max": 100,
            "title": "學習單字",
            "help_img": "img/loading.svg",
            "help": "設定每天目標學習的單字數量。"
        },
        {
            "key": "note",
            "default_target": 20,
            "min": 0,
            "max": 100,
            "title": "撰寫筆記",
            "help_img": "img/loading.svg",
            "help": "設定每天要撰寫的筆記數量。\n針對不同單字，寫下你對不同單字的筆記與想法。\n字數及內容不拘，可隨意發揮。"
        },
        {
            "key": "test",
            "default_target": 30,
            "min": 0,
            "max": 100,
            "title": "答對測驗",
            "help_img": "img/loading.svg",
            "help": "設定每天目標答對的題目數量。\n題目都是三選一的選擇題。"
        }
    ];

    $scope.target_data = {};
    
    $scope._target_data_mock = {
        "learn": {
            done: 0,
            target: 30
            
        }
    };

    // --------------------------

    $scope.ctl_target = {};
    $scope.ctl_target._init_target_data = function () {
        for (var _i = 0; _i < $scope.target_setting.length; _i++) {
            var _item = $scope.target_setting[_i];
            var _key = _item.key;
            var _target = _item.default_target;
            $scope.target_data[_key] = {
                "done": 0,
                "target": _target
            };
        }
    };
        
    $scope.ctl_target._init_target_data();
    
    /**
     * 
     * @param {boolean} _animate 是否要動畫
     */
    $scope.ctl_target.enter_from_profile = function (_animation) {
        
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
        $.console_trace($scope.target_data);
        $scope.ctl_target.target_exists(function (_exists) {
            var _page = "target_view.html";
            if (_exists === false) {
                _page = "target_set.html";
            }
            //$.console_trace(_animation);
            app.navi.replacePage(_page, _animation);
        });
        return this;
    };
    /**
     * 未完成
     * @TODO #
     * @param {type} _callback
     * @returns {undefined}
     */
    $scope.ctl_target.target_exists = function (_callback) {
        var _exists = false;
        $.trigger_callback(_callback, _exists);
    };
    $scope.ctl_target.get_set_title = function () {
        var _date = new Date(new Date().getTime() - _target_offset_hours * 60 * 60 * 1000);
        var _month = _date.getMonth() + 1;
        var _day = _date.getDate();
        var _title = "設定" + _month + "月" + _day + "日目標";
        return _title;
    }
    ;
    $scope.ctl_target.set_target = function ($event) {
        var _form = $($event.target);
        var _log_data = {};
        for (var _key in $scope.target_data) {
            var _target = _form.find('input[target_key="' + _key + '"]').val();
            $scope.target_data[_key].target = _target;
            _log_data[_key] = _target;
        }
        
        $scope.log("controller_target.js", "$scope.ctl_target.set_target()", _log_data);
        //$.console_trace(_log_data);
        
        $scope.ctl_activity.enter_from_target();
        
        // 把現在的狀態儲存進資料表中
        $scope.db_status.save_status(_status_key);
    };
    
    // 註冊
    $scope.db_status.add_listener(_status_key
        , function (_status) {
            $scope.target_data = _status;
        }
        , function () {
            return $scope.target_data;
    });
    
    $scope.target_help = {
        help_img: "img/loading.svg",
        help: ""
    };
    
    $scope.ctl_target.show_help = function(_key) {
        var _setting = $scope.ctl_target._get_setting(_key);
        $scope.target_help.help_img = _setting.help_img;
        $scope.target_help.help = _setting.help;
        
        target_help_modal.show();
    };
    
    $scope.ctl_target._get_setting = function (_key) {
        for (var _i = 0; _i < $scope.target_setting.length; _i++) {
            var _setting = $scope.target_setting[_i];
            if (_setting.key === _key) {
                return _setting;
            }
        }
    };
    
    $scope.ctl_target.get_target = function (_key) {
        //$.console_trace(_key);
        var _setting = $scope.ctl_target._get_setting(_key);
        var _target = _setting.default_target;
        if (_target < _setting.min) {
            _target = _setting.min;
        }
        else if (_target > _setting.max) {
            _target = _setting.max;
        }
        return _target;
    };
    
    $scope.ctl_target.change_target_number = function ($event, _interval) {
        if (typeof(_interval) !== "number") {
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
};