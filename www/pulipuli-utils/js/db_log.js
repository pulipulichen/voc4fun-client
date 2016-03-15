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
    var _debug_log_day_offset = $scope.CONFIG.day_offset;

    //var _server_url = $scope.CONFIG.server_url;

//    setTimeout(function () {
//        //$scope.db_log.reset();
//    }, 0);

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
    $scope.log = function (_file_name, _function_name, _qualifier, _data, _callback) {
        //_ctl._init_db(function () {
        if (_function_name === "set_target()") {
            $.console_trace("set_target()");
        }

            if (typeof (_qualifier) === "object"
                    && typeof (_data) === "undefined") {
                _data = _qualifier;
                _qualifier = undefined;
            }
            if (typeof (_data) === "undefined") {
                _data = null;
            }

            var _timestamp = $scope.db_log.get_timestamp(0);
            var _insert_data = {
                timestamp: _timestamp,
                file_name: _file_name,
                function_name: _function_name,
                qualifier: _qualifier,
                data: JSON.stringify(_data)
            };
            //$.console_trace(_insert_data);
            $scope.DB.insert(_log_db, _insert_data, _callback);
        //});
        return this;
    };

    //$scope.db_status.ready(function () {
    //    $scope.DB.create_table(_log_db, _log_db_fields);
    //});


    // -------------------------------------------------

    var _ctl = {};

//    _ctl._init_db = function (_callback) {
//        $scope.DB.table_exists(_log_db, function (_is_exits) {
//            if (_is_exits === true) {
//                $.trigger_callback(_callback);
//            }
//            else {
//                //$scope.DB.create_table(_log_db, _log_db_fields, _callback);
//                $scope.DB.register_table(_log_db, _log_db_fields, _callback);
//            }
//        });
//    };
    $scope.DB.register_table(_log_db, _log_db_fields);

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
    _ctl.get_latest_log = function (_opt) {
        //_ctl._init_db(function () {



            var _file_name = $.parse_opt(_opt, "file_name");
            var _function_name = $.parse_opt(_opt, "function_name");
            var _qualifier = $.parse_opt(_opt, "qualifier");
            var _where_sql = $.parse_opt(_opt, "where_sql");
            var _min_timestamp = $.parse_opt(_opt, "min_timestamp");
            var _max_timestamp = $.parse_opt(_opt, "max_timestamp");
            var _return_timestamp = $.parse_opt(_opt, "return_timestamp", false);
            var _callback = $.parse_opt(_opt, "callback");

            if (typeof (_min_timestamp) === "number"
                    || typeof (_max_timestamp) === "number") {
                var _timestamp_where_sql = _ctl.create_timestamp_where_sql(_min_timestamp, _max_timestamp);
                if (_where_sql === undefined) {
                    _where_sql = _timestamp_where_sql;
                }
                else {
                    _where_sql = _where_sql + " AND " + _timestamp_where_sql;
                }
            }

//        _file_name = _ctl._create_where_sql("file_name", _file_name);
//        _function_name = _ctl._create_where_sql("function_name", _function_name);
//        _qualifier = _ctl._create_where_sql("qualifier", _qualifier);
//
//        var _sql = "SELECT data FROM log "
//                + " WHERE " + _file_name
//                + " AND " + _function_name;

            var _where_array = [];
            if (typeof (_file_name) === "string") {
                _where_array.push('file_name = "' + _file_name + '"');
            }
            if (typeof (_function_name) === "string") {
                _where_array.push('function_name = "' + _function_name + '"');
            }
            if (typeof (_qualifier) === "string") {
                _where_array.push('qualifier = "' + _qualifier + '"');
            }
            if (typeof (_where_sql) === "string") {
                _where_array.push(_where_sql);
            }

            _where_sql = _where_array.join(" AND ");

            var _sql = "SELECT timestamp, data FROM log ";
            if (_where_sql !== undefined && _where_sql !== "") {
                _sql = _sql + " WHERE " + _where_sql;
            }

            _sql = _sql + " ORDER BY timestamp DESC LIMIT 0,1";

            $scope.DB.exec(_sql, function (_row) {
                var _data;
                if (_row.length > 0) {
                    _data = $.json_parse(_row[0].data);
                    
                    if (_return_timestamp === true) {
                        _data["_timestamp"] = _row[0].timestamp;
                    }
                }
                $.trigger_callback(_callback, _data);
            });
        //});
    };
    
    _ctl._create_where_sql = function (_field_name, _data) {
        var _sql = "";
        if (typeof (_data) === "string") {
            _sql = " " + _field_name + " = '" + _data + "' ";
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
    _ctl.count_log = function (_opt) {
        //_ctl._init_db(function () {


            var _file_name = $.parse_opt(_opt, "file_name");
            var _function_name = $.parse_opt(_opt, "function_name");
            var _qualifier = $.parse_opt(_opt, "qualifier");
            var _where_sql = $.parse_opt(_opt, "where_sql");
            var _min_timestamp = $.parse_opt(_opt, "min_timestamp");
            var _max_timestamp = $.parse_opt(_opt, "max_timestamp");
            var _callback = $.parse_opt(_opt, "callback");

            if (typeof (_min_timestamp) === "number"
                    || typeof (_max_timestamp) === "number") {
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
        //});
    };

    _ctl.reset = function () {
        $scope.DB.empty_table(_log_db);
    };

    /**
     * @param {number} _offset 偏移天數
     * @returns {Number}
     */
    _ctl.get_timestamp = function (_offset) {
        var _timestamp = (new Date()).getTime();

        if (_debug_log_day_offset !== 0) {
            _timestamp = _timestamp + _debug_log_day_offset * 24 * 60 * 60 * 1000;
        }
        
        if (typeof (_offset) === "number") {
            _timestamp = _timestamp + _offset * 24 * 60 * 60 * 1000;
        }

        return _timestamp;
    };

    _ctl.create_timestamp_where_sql = function (_min_time, _max_time) {
        var _where_sql = "";
        if (typeof (_min_time) === "number") {
            _where_sql = _where_sql + " timestamp > " + _min_time;
        }
        if (typeof (_max_time) === "number") {

            if (_where_sql !== "") {
                _where_sql = _where_sql + " AND ";
            }
            _where_sql = _where_sql + " timestamp < " + _max_time;
        }
        return _where_sql;
    };

    _ctl.set_debug_log_day_offset = function (_offset, _callback) {
        _debug_log_day_offset = _offset;
        if (typeof (_callback) === "function") {
            _callback();
            _debug_log_day_offset = 0;
        }
    };

    // ----------------------------------

    var _syncing = false;
    _ctl.sync = function (_callback) {
        //ctl._init_db(function () {
        //$.console_trace("開始同步");

        if (typeof($scope.CONFIG.server_url) !== "string") {
            //$.console_trace("沒有遠端伺服器");
            return;
        }

            var _url = $scope.CONFIG.server_url + "model/sync.php";

            if (_syncing === true) {
                // 防止重複同步
                $.trigger_callback(_callback);
                return;
            }
            _syncing = true;

            var _data = {
                uuid: $scope.ctl_profile.get_uuid(),
                timestamp: 0
            };

            var _sync_complete = function () {
                _syncing = false;
                $.trigger_callback(_callback);
            };

            _ctl.get_latest_log_timestamp(function (_timestamp) {
                _data.timestamp = _timestamp;
                $.getJSON(_url, _data, function (_result) {
                    //$.console_trace("getJSON", _result);
                    if (typeof (_result) === "boolean" && _result === true) {
                        // 表示沒有資料需要更新
                        _sync_complete();
                    }
                    else if (typeof (_result) === "number") {
                        // push 模式
                        _ctl.sync_push(_result, _sync_complete);
                    }
                    else if ($.is_array(_result)
                            || (typeof (_result) === "object" && typeof (_result.timestamp) !== "undefined")) {
                        // pull 模式
                        //$.console_trace("pull模式", _result);
                        _ctl.sync_pull(_result, _sync_complete);
                    }
                });
            });
        //});
    };

    _ctl.get_latest_log_timestamp = function (_callback) {
        //_ctl._init_db(function () {


            var _sql = "SELECT timestamp FROM log ORDER BY timestamp DESC limit 0, 1";
            $scope.DB.exec(_sql, function (_data) {
                var _timestamp = 0;
                if (_data.length > 0) {
                    _timestamp = _data[0].timestamp;
                    //$.console_trace("")
                    //_timestamp = parseInt(_timestamp, 10);
                }
                $.trigger_callback(_callback, _timestamp);
            });
        //});
    };

    _ctl.sync_push = function (_server_timestamp, _callback) {
        //_ctl._init_db(function () {
            
        if (typeof($scope.CONFIG.server_url) !== "string") {
            return;
        }
        var _url = $scope.CONFIG.server_url + "model/sync.php";
        //$.console_trace("sync_push: " + _server_timestamp);


        // 先準備好要傳過去的資料
        var _sql = "SELECT timestamp, file_name, function_name, qualifier, data "
                + " FROM log WHERE timestamp > " + _server_timestamp
                + " ORDER BY timestamp ASC";
        $scope.DB.exec(_sql, function (_logs) {
            if (_logs.length > 0) {
                _ctl.sync_complete("push", function (_log) {
                    _logs.push(_log);

                    var _data = {
                        uuid: $scope.ctl_profile.get_uuid(),
                        logs: JSON.stringify(_logs)
                    };
                    $.post(_url, _data, function () {
                        $.trigger_callback(_callback);
                    });
                });
            }
            else {
                $.trigger_callback(_callback);
            }
        });
        //});
    };

    /**
     * @param {Array} _logs
     * @param {Function} _callback
     */
    _ctl.sync_pull = function (_logs, _callback) {
        //_ctl._init_db(function () {
            
        
        $scope.DB.insert("log", _logs, function () {
            _ctl.sync_complete("pull", function (_log) {
                
                if (typeof($scope.CONFIG.server_url) !== "string") {
                    return;
                }
                var _url = $scope.CONFIG.server_url + "model/sync.php";

                $.console_trace("sync_pull", _log);

                var _data = {
                    uuid: $scope.ctl_profile.get_uuid(),
                    logs: JSON.stringify(_log)
                };

                $.post(_url, _data, function () {
                    $.trigger_callback(_callback);
                });
            });
        });
        //});
    };

    _ctl.sync_complete = function (_qualifier, _callback) {
        return $scope.log("db_log.js", "sync_complete()", _qualifier, undefined, function () {
            // 查詢最新插入的log?
            var _sql = "SELECT timestamp, file_name, function_name, qualifier, data "
                    + " FROM log "
                    + " WHERE file_name = 'db_log.js' AND function_name = 'sync_complete()' "
                    + " ORDER BY timestamp DESC limit 1";

            $scope.DB.exec(_sql, function (_row) {
                var _log = _row[0];
                $.trigger_callback(_callback, _log);
            });
        });
    };

    // ----------------------------------

    /**
     * 監聽sync的事件
     */
    _ctl.sync_init = function () {
        var _sync = function (_callback) {
            _ctl.sync(_callback);
        };

        if (typeof (cordova) === "undefined") {
            // 桌面版的情況

            // 開啟
            $(window).on("load", _sync);

            // 暫離
            $(window).on("blur", _sync);

            // 關閉
            $(window).on("unload", _sync);
        }
        else {
            // 手機版的情況
            document.addEventListener("deviceready", function () {
                _sync();

                // 暫離
                document.addEventListener("pause", _sync, false);

                // 連線時
                document.addEventListener("online", _sync, false);

            }, false);
        }
        
        if ($scope.CONFIG.sync_interval > 0) {
            var _time = $scope.CONFIG.sync_interval * 1000 * 60;
            setInterval(_sync, _time);
        }

        // 離開的情況
        $scope.ons_view.exit_app_add_listener(_sync);
    };
    _ctl.sync_init();

    // ----------------------------------

    _ctl.get_uuid = function () {
        var _fingerprint = new Fingerprint().get();
        return $.int_to_letters(_fingerprint);
    };

    // ----------------------------------

    $scope.db_log = _ctl;
};