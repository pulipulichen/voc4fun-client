var controller_target_history = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_target_history.js";

    var _table_name = "target_history";
    var _field_list = ["year", "month", "day", "target_data", "complete_percent"];

    // -------------------------------------------------

    _ctl.add = function (_date, _complete_percent, _target_data, _callback) {
//        _ctl._init_db();
        
        var _add_process = function () {
            var _data = {
                year: _date.year,
                month: _date.month,
                day: _date.day,
                complete_percent: _complete_percent,
                target_data: _target_data
            };

            $scope.DB.insert(_table_name, _data, _callback);

            // ------------------

            $scope.log(_log_file, "add()", _complete_percent, _target_data);
        };

//        var _where_sql = " year = " + _date.year
//                + " AND month = " + _date.month
//                + " AND day = " + _date.day;
        var _where_data = {
            "year": _date.year,
            "month": _date.month,
            "day": _date.day
        };
        
        // 不要重複記錄啊
        $scope.DB.count(_table_name, _where_data, function (_result) {
            if (_result === 0) {
                _add_process();
            }
        });
    };


//    var _table_inited = false;
////    _ctl._init_db = function (_callback) {
//        if (_table_inited === false) {
//            _table_inited = true;
//
//            //$scope.DB.create_table(_table_name, _field_list, _callback);
//            //$scope.DB.register_table(_table_name, _field_list, _callback);
//        }
//        else {
//            $.trigger_callback(_callback);
//        }
//        return this;
//    };
//    //_ctl._init_db();
//    
//    
    $scope.DB.register_table(_table_name, _field_list);

    // -------------------------------------------------

    $scope.ctl_target_history = _ctl;

};