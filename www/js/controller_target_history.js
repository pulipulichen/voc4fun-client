var controller_target_history = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_target_history.js";

    var _table_name = "target_history";
    var _field_list = ["year", "month", "day", "target_data"];

    // -------------------------------------------------

    _ctl.add = function (_date, _complete_percent, _target_data, _callback) {
        _ctl._init_db();
        
        var _data = {
            year: _date.year,
            month: _date.month,
            day: _date.day,
            complete_percent: _complete_percent,
            target_date: _target_data
        };
        $scope.DB.insert(_table_name, _data, _callback);
        
        // ------------------
        
        $scope.log(_log_file, "add", _complete_percent, _target_data);
    };


    var _table_inited = false;
    _ctl._init_db = function (_callback) {
        if (_table_inited === false) {
            _table_inited = true;
            
            $scope.DB.create_table(_table_name, _field_list, _callback);
        }
        else {
            $.trigger_callback(_callback);
        }
        return this;
    };

    // -------------------------------------------------

    $scope.ctl_target_history = _ctl;

};