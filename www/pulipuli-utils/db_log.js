/**
 * 
 * 使用範例：$scope.log("app_ready.js", "ons.ready()", {"ok": true});
 * 
 * @param {Object} $scope
 * @returns {undefined}
 */
var db_log = function ($scope) {

    /**
     * 測試用，讓記錄時間偏倚的參數，單位是天
     * 例如設定_debug_log_day_offset = -1
     * 那記錄的時間就會是-1天
     * @type Number
     */
    var _debug_log_day_offset = 0;
    
    var _server_url = $scope.CONFIG.server_url;
    
    setTimeout(function () {
        //$scope.db_log.reset();
    }, 0);

    var _log_db = "log";
    
    var _log_db_fields = [
        "timestamp",
        "file_name",
        "function_name",
        "qualifier",
        "data"
    ];

    /**
     * 
     * @param {string} _file_name
     * @param {string} _function_name
     * @param {string} _qualifier 可以省略，省略後變成_data
     * @param {JSON} _data 可以省略
     * @returns {db_log.$scope}
     */
    $scope.log = function (_file_name, _function_name, _qualifier, _data) {

        if (typeof (_qualifier) === "object"
                && typeof (_data) === "undefined") {
            _data = _qualifier;
            _qualifier = undefined;
        }
        if (typeof (_data) === "undefined") {
            _data = null;
        }

        var _timestamp = $scope.db_log.get_timestamp();
        var _insert_data = {
            timestamp: _timestamp,
            file_name: _file_name,
            function_name: _function_name,
            qualifier: _qualifier,
            data: JSON.stringify(_data)
        };
        //$.console_trace(_insert_data);
        $scope.DB.insert(_log_db, _insert_data);
        return this;
    };

    $scope.DB.create_table(_log_db, _log_db_fields);

    $scope.db_log = {};

    /**
     * @param {type} _opt = {
     *      "file_name"
     *      "function_name"
     *      "qualifier"
     *      "where_sql"
     *      "min_timestamp"
     *      "max_timestamp"
     *      "callback"
     * }
     */
    $scope.db_log.get_latest_log = function (_opt) {
        var _file_name = $.parse_opt(_opt, "file_name");
        var _function_name = $.parse_opt(_opt, "function_name");
        var _qualifier = $.parse_opt(_opt, "qualifier");
        var _where_sql = $.parse_opt(_opt, "where_sql");
        var _min_timestamp = $.parse_opt(_opt, "min_timestamp");
        var _max_timestamp = $.parse_opt(_opt, "max_timestamp");
        var _callback = $.parse_opt(_opt, "callback");
        
        if (typeof(_min_timestamp) === "number" 
                || typeof(_max_timestamp) === "number" ) {
            var _timestamp_where_sql = $scope.db_log.create_timestamp_where_sql(_min_timestamp, _max_timestamp);
            if (_where_sql === undefined) {
                _where_sql = _timestamp_where_sql;
            }
            else {
                _where_sql = _where_sql + " AND " + _timestamp_where_sql;
            }
        }
        
        _file_name = $scope.db_log._create_where_sql("file_name", _file_name);
        _function_name = $scope.db_log._create_where_sql("function_name", _function_name);
        _qualifier = $scope.db_log._create_where_sql("qualifier", _qualifier);
        
        var _sql = "SELECT data FROM log "
            + " WHERE " + _file_name
            + " AND " + _function_name;
        if (_qualifier !== "") {
            _sql = _sql + " AND " + _qualifier;
        }
        if (_where_sql !== undefined) {
            _sql = _sql + " AND " + _where_sql;
        }
        _sql = _sql + " ORDER BY timestamp DESC LIMIT 0,1";
        
        $scope.DB.exec(_sql, function (_row) {
            var _data;
            if (_row.length > 0) {
                _data = JSON.parse(_row[0].data);
            }
            $.trigger_callback(_callback, _data);
        });
    };
    
    $scope.db_log._create_where_sql = function (_field_name, _data) {
        var _sql = "";
        if (typeof(_data) === "string") {
            _sql = " " + _field_name + " = '" +  _data + "' ";
        }
        else if ($.is_array(_data)) {
            var _sql = " (";
            for (var _i = 0; _i < _data.length; _i++) {
                if (_i > 0) {
                    _sql = _sql + " OR ";
                }
                _sql = _sql + " " + _field_name + " = '" + _data[_i] + "' ";
            }
            _sql = _sql + ") ";
        }
        return _sql;
    };
    
    /**
     * @param {type} _opt = {
     *      "file_name"
     *      "function_name"
     *      "qualifier"
     *      "where_sql"
     *      "min_timestamp"
     *      "max_timestamp"
     *      "callback"
     * }
     */
    $scope.db_log.count_log = function (_opt) {
        var _file_name = $.parse_opt(_opt, "file_name");
        var _function_name = $.parse_opt(_opt, "function_name");
        var _qualifier = $.parse_opt(_opt, "qualifier");
        var _where_sql = $.parse_opt(_opt, "where_sql");
        var _min_timestamp = $.parse_opt(_opt, "min_timestamp");
        var _max_timestamp = $.parse_opt(_opt, "max_timestamp");
        var _callback = $.parse_opt(_opt, "callback");
        
        if (typeof(_min_timestamp) === "number" 
                || typeof(_max_timestamp) === "number" ) {
            var _timestamp_where_sql = $scope.db_log.create_timestamp_where_sql(_min_timestamp, _max_timestamp);
            if (_where_sql === undefined) {
                _where_sql = _timestamp_where_sql;
            }
            else {
                _where_sql = _where_sql + " AND " + _timestamp_where_sql;
            }
        }
        
        _file_name = $scope.db_log._create_where_sql("file_name", _file_name);
        _function_name = $scope.db_log._create_where_sql("function_name", _function_name);
        _qualifier = $scope.db_log._create_where_sql("qualifier", _qualifier);
        
        var _sql = "SELECT data FROM log "
            + " WHERE " + _file_name
            + " AND " + _function_name;
        if (_qualifier !== "") {
            _sql = _sql + " AND " + _qualifier;
        }
        if (_where_sql !== undefined) {
            _sql = _sql + " AND " + _where_sql;
        }
        
        $scope.DB.exec(_sql, function (_row) {
            $.trigger_callback(_callback, _row.length);
        });
    };
    
    $scope.db_log.reset = function () {
        $scope.DB.empty_table(_log_db);
    };
    
    /**
     * @param {number} _offset 偏移天數
     * @returns {Number}
     */
    $scope.db_log.get_timestamp = function (_offset) {
        var _timestamp = (new Date()).getTime();
        
        if (_debug_log_day_offset !== 0) {
            _timestamp = _timestamp + _debug_log_day_offset * 24 * 60 * 60 * 1000;
        }
        if (typeof(_offset) === "number") {
            _timestamp = _timestamp + _offset * 24 * 60 * 60 * 1000;
        }
        
        return _timestamp;
    };
    
    $scope.db_log.create_timestamp_where_sql = function (_min_time, _max_time) {
        var _where_sql = "";
        if (typeof(_min_time) === "number") {
            _where_sql = _where_sql + " timestamp > " + _min_time;
        }
        if (typeof(_max_time) === "number") {
            
            if (_where_sql !== "") {
                _where_sql = _where_sql + " AND ";
            }
            _where_sql = _where_sql + " timestamp < " + _max_time;
        }
        return _where_sql;
    };
};