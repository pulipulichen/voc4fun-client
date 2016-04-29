var db_status = function ($scope) {
    
    var _table_name = 'status';
    var _field_list = ['key', 'status'];
    var _listeners = [];
    var _keys = [];

    //$scope.DB.drop_table(_table_name);

    //var _db_status = {};

    var _ctl = {};

    _ctl.add_listener = function (_key, _open_callback, _close_callback) {
        //$.console_trace("status add_listener", [_key]);
        var _listener = {};
        _listener.key = _key;
        if (typeof (_open_callback) === "function") {
            _listener.open_callback = _open_callback;
        }
        if (typeof (_close_callback) === "function") {
            _listener.close_callback = _close_callback;
        }
        _listeners.push(_listener);
        _keys.push(_key);
        return this;
    };

    //_ctl._init = function () {
        //$scope.DB.create_table(_table_name, _field_list);
        //$scope.DB.register_table(_table_name, _field_list);
    //};
    //_ctl._init();

    _ctl.save_to_db = function (_callback) {
        var _data = [];
        for (var _l = 0; _l < _listeners.length; _l++) {
            if (typeof (_listeners[_l].close_callback) === "function") {
                var _close_status = _listeners[_l].close_callback();
//                _data.push({
//                    key: _listeners[_l].key,
//                    status: _close_status
//                });
                
                $.console_trace("儲存");
                $scope.ls.set(_table_name + "_" + _listeners[_l].key, _close_status);
            }
        }

//        var _loop = function (_i) {
//            if (_i < _data.length) {
//                var _status = _data[_i].status;
//                //var _data = JSON.stringify(_status);
//
////                var _where_sql = 'key = "' + _data[_i].key + '"';
////                $scope.DB.insert_or_update(_table_name, _data, _where_sql, function () {
////                    _i++;
////                    _loop(_i);
////                });
//                $scope.ls.set(_table_name, _data[_i].key, _status);
//                _i++;
//                _loop(_i);
//            }
//            else {
//                $.trigger_callback(_callback);
//            }
//        };
//        _loop(0);
        //$scope.ls.set(_table_name, _data);
        $.trigger_callback(_callback);
        return this;
    };

    _ctl.save_status = function (_key) {
        //var _where_sql = 'key = "' + _key + '"';

        var _status;
        for (var _l = 0; _l < _listeners.length; _l++) {
            if (typeof (_listeners[_l].close_callback) === "function" && _listeners[_l].key === _key) {
                _status = _listeners[_l].close_callback();
                //$.console_trace("save_status()" , _key);
                //$scope.ls.set(_table_name, _key, _status);
                
                $scope.ls.set(_table_name + "_" + _key, _status);
                //_status = JSON.stringify(_status);
                break;
            }
        }

//        var _data = {
//            key: _key,
//            status: _status
//        };

        //$scope.DB.insert_or_update(_table_name, _data, _where_sql);
        //$scope.ls.set(_table_name, _key, _status);
        return this;
    };

    _ctl.load_from_db = function (_callback) {
        //$.console_trace("_ctl.load_from_db = function (_callback) {");
//        $scope.DB.get(_table_name, function (_data) {
//            //$.console_trace("$scope.DB.get(_table_name, function (_data) {");
//            for (var _d = 0; _d < _data.length; _d++) {
//
//                var _key = _data[_d].key;
//
//                var _status = _data[_d].status;
//                //$.console_trace("1 _status = JSON.parse(_status);");
//                _status = $.json_parse(_status);
//                //$.console_trace("2 _status = JSON.parse(_status);");
//
//                for (var _l = 0; _l < _listeners.length; _l++) {
//                    if (_listeners[_l].key === _key) {
//                        if (typeof (_listeners[_l].open_callback) === "function") {
//                            _listeners[_l].open_callback(_status);
//                        }
//                        break;
//                    }
//                }
//            }
//            //$.console_trace("$.trigger_callback(_callback);");
//            $.trigger_callback(_callback);
//        });
        
        //var _data = $scope.ls.get(_table_name);
        //var _keys  = _ctl.get_keys();
        //$.console_trace("呼叫status", _data);
        for (var _i = 0; _i < _keys.length; _i++) {
            var _key = _keys[_i];
            //var _key = _data[_d].key;

            //var _status = _data[_key];
            var _status = $scope.ls.get(_table_name + "_" + _key);
            if (_status === undefined) {
                //_status = {};
                continue;
            }
            //$.console_trace(_key, _status);
            //$.console_trace("1 _status = JSON.parse(_status);");
            //_status = $.json_parse(_status);
            //$.console_trace("2 _status = JSON.parse(_status);");

            for (var _l = 0; _l < _listeners.length; _l++) {
                if (_listeners[_l].key === _key) {
                    if (typeof (_listeners[_l].open_callback) === "function") {
                        _listeners[_l].open_callback(_status);
                    }
                    break;
                }
            }
        }
        //$.console_trace("$.trigger_callback(_callback);");
        $.trigger_callback(_callback);
    };

    var _ready_listener = [];
    var _is_ready = false;

    _ctl.ready = function (_callback) {
        //$.console_trace("_ctl.ready()");
        if (typeof (_callback) === "function") {
            if (_is_ready === false) {
                //$.console_trace("if (_is_ready === false) {");
                _ready_listener.push(_callback);
            }
            else {
                $.trigger_callback(_callback);
            }
        }
    };
    
    _ctl._trigger_ready = function () {
        //$.console_trace("_trgger_ready", _ready_listener.length);
        //_is_ready = true;
        for (var _r = 0; _r < _ready_listener.length; _r++) {
            $.trigger_callback(_ready_listener[_r]);
        }
    };
    
//    _ctl.get_keys = function () {
////        var _keys = $scope.ls.get(_table_name + "_keys");
////        if (_keys === undefined) {
////            _keys = [];
////        }
//        return _keys;
//    };
    
    _ctl.init_ons_ready = function () {
        //$.console_trace("_ctl.init_ons_ready");
        ons.ready(function () {
            //$.console_trace("ons.ready(function () {");
            _ctl.load_from_db(function () {
                //$.console_trace("_ctl.load_from_db(function () {");
                _ctl._trigger_ready();
            });
        });
    };
    _ctl.init_ons_ready();
    
    $scope.db_status = _ctl;

    // 離開時候的註冊……
    // @TODO #33
};