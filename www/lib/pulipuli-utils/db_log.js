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
        $scope.DB.create_table(_log_db, _log_db_fields, function () {
            if (typeof(_qualifier) === "object" 
                    && typeof(_data) === "undefined") {
                _data = _qualifier;
                _qualifier = undefined;
            }
            if (typeof(_data) === "undefined") {
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
        });
        return this;
    };
};