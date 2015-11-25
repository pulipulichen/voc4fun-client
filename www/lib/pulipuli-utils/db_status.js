var db_status = function ($scope) {
    var _table_name = 'status';
    var _field_list = ['key', 'status'];
    var _listeners = [];
    
    //$scope.DB.drop_table(_table_name);
    
    $scope.db_status = {};
    
    $scope.db_status.add_listener = function (_key, _open_callback, _close_callback) {
        var _listener = {};
        _listener.key = _key;
        if (typeof(_open_callback) === "function") {
            _listener.open_callback = _open_callback;
        }
        if (typeof(_close_callback) === "function") {
            _listener.close_callback = _close_callback;
        }
        _listeners.push(_listener);
        return this;
    };
    
    $scope.db_status._init = function () {
        $scope.DB.create_table(_table_name, _field_list);
    };
    $scope.db_status._init();
    
    $scope.db_status.save_to_db = function (_callback) {
        var _data = [];
        for (var _l = 0; _l < _listeners.length; _l++) {
            if (typeof(_listeners[_l].close_callback) === "function") {
                _data.push({
                    key: _listeners[_l].key,
                    status: _listeners[_l].close_callback()
                });
            }
        }
        
        var _loop = function (_i) {
            if (_i < _data.length) {
                var _status = _data[_i].status;
                var _data = JSON.stringify(_status);
                
                var _where_sql = 'key = "' + _data[_i].key + '"';
                $scope.DB.insert_or_update(_table_name, _data, _where_sql, function () {
                    _i++;
                    _loop(_i);
                });
            }
            else {
                $.trigger_callback(_callback);
            }
        };
        _loop(0);
        return this;
    };
    
    $scope.db_status.save_status = function (_key) {
        var _where_sql = 'key = "' + _key + '"';
        
        var _status;
        for (var _l = 0; _l < _listeners.length; _l++) {
            if (typeof(_listeners[_l].close_callback) === "function") {
                _status = _listeners[_l].close_callback();
                _status = JSON.stringify(_status);
                break;
            }
        }
        
        var _data = {
            key: _key,
            status: _status
        };
        
        $scope.DB.insert_or_update(_table_name, _data, _where_sql);
        return this;
    };
    
    $scope.db_status.load_from_db = function () {
        $scope.DB.get(_table_name, function (_data) {
            for (var _d = 0; _d < _data.length; _d++) {
                
                var _key = _data[_d].key;
                
                var _status = _data[_d].status;
                _status = JSON.parse(_status);
                
                for (var _l = 0; _l < _listeners.length; _l++) {
                    if (_listeners[_l].key === _key) {
                        if (typeof(_listeners[_l].open_callback) === "function") {
                            _listeners[_l].open_callback(_status);
                        }
                        break;
                    }
                }
            }
        });
    };
    
    ons.ready(function () {
        $scope.db_status.load_from_db();
    });
    
    // 離開時候的註冊……
    // @TODO #33
};