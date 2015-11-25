/**
 * 
 * 使用範例：$scope.log("app_ready.js", "ons.ready()", {"ok": true});
 * 
 * @param {Object} $scope
 * @returns {undefined}
 */
var db_log = function ($scope) {

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

        var _timestamp = (new Date()).getTime();
        var _insert_data = {
            timestamp: _timestamp,
            file_name: _file_name,
            function_name: _function_name,
            qualifier: _qualifier,
            data: JSON.stringify(_data)
        };
        $scope.DB.insert(_log_db, _insert_data);
        return this;
    };

    $scope.DB.create_table(_log_db, _log_db_fields);

    $scope.db_log = {};

    $scope.db_log.get_last_log = function (_file_name, _function_name, _qualifier, _where_sql, _callback) {
        if (typeof(_qualifier) === "string" 
                && typeof(_where_sql) === "function" 
                && typeof(_callback) === "undefined") {
            _callback = _where_sql;
            _where_sql = _qualifier;
            
            _qualifier = undefined;
        }
        else if (typeof(_qualifier) === "function") {
            _callback = _qualifier;
            
            _where_sql = undefined;
            _qualifier = undefined;
        };
        
        var _sql = "SELECT data FROM log "
            + " WHERE file_name = '" +  _file_name + "'"
            + " AND function_name = '" + _function_name + "' ";
        if (_qualifier !== undefined) {
            _sql = _sql + " AND qualifier = '" + _qualifier + "'";
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
    
    $scope.db_log.reset = function () {
        $scope.DB.empty_table(_log_db);
    };
    
    //$scope.db_log.reset();
};