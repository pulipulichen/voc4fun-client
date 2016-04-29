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
     * 20160315 websql 完美
     */
    $scope.log = function (_file_name, _function_name, _qualifier, _data, _callback) {
        //_ctl._init_db(function () {
        //if (_function_name === "set_target()") {
        //   $.console_trace("set_target()");
        //}

            if (typeof (_qualifier) === "object"
                    && typeof (_data) === "undefined") {
                _data = _qualifier;
                _qualifier = undefined;
            }
            if (typeof (_data) === "undefined") {
                _data = null;
            }
            if (typeof (_qualifier) === "undefined") {
                _qualifier = null;
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
            //alert(JSON.stringify(_insert_data));
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
     *      "callback": fucntion (_data) {}
     * }
     * 20160315 websql 完美
     */
    _ctl.get_latest_log = function (_opt) {
        
        var _return_timestamp = $.parse_opt(_opt, "return_timestamp", false);
        var _callback = $.parse_opt(_opt, "callback");
        
        var _where = _ctl._create_log_where(_opt);

        var _sql = "SELECT timestamp, data FROM log ";
        if (_where.sql !== undefined && _where.sql !== "") {
            _sql = _sql + " WHERE " + _where.sql;
        }

        _sql = _sql + " ORDER BY timestamp DESC LIMIT 0,1";

        $scope.DB.exec(_sql, _where.data, function (_row) {
            var _data;
            if (_row.length > 0) {
                _data = $.json_parse(_row[0].data);

                if (_return_timestamp === true) {
                    _data["_timestamp"] = _row[0].timestamp;
                }
            }
            $.trigger_callback(_callback, _data);
        });
    };
    
    _ctl._create_log_where = function (_opt) {
        var _file_name = $.parse_opt(_opt, "file_name");
        var _function_name = $.parse_opt(_opt, "function_name");
        var _qualifier = $.parse_opt(_opt, "qualifier");
        var _min_timestamp = $.parse_opt(_opt, "min_timestamp");
        var _max_timestamp = $.parse_opt(_opt, "max_timestamp");

        var _where_sql = $.parse_opt(_opt, "where_sql", "");
        var _where_data_array = $.parse_opt(_opt, "where_data_array", []);
        
        // --------------------------------

        var _where_array = [];

        if (_where_sql !== "") {
            _where_array.push(_where_sql);
            //至此剛好跟_where_data_array搭配
        }

        var _timestamp_where_sql = _ctl.create_timestamp_where_sql(_min_timestamp, _max_timestamp);
        if (_timestamp_where_sql !== undefined) {
            _where_array.push(_timestamp_where_sql.sql);
            _where_data_array = $.array_append(_where_data_array, _timestamp_where_sql.data);
        }


        if (typeof (_file_name) === "string") {
            _where_array.push('file_name = ?');
            _where_data_array.push(_file_name);
        }
        if (typeof (_function_name) === "string") {
            _where_array.push('function_name = ?');
            _where_data_array.push(_function_name);
        }
        if (typeof (_qualifier) === "string") {
            _where_array.push('qualifier = ?');
            _where_data_array.push(_qualifier);
        }

        _where_sql = _where_array.join(" AND ");
        
        return {
            "sql": _where_sql,
            "data": _where_data_array
        };
    };
    
    _ctl._create_where_sql = function (_field_name, _data) {
        var _sql = "";
        var _sql_data = [];
        if (typeof (_data) === "string") {
            _sql = " " + _field_name + " = ? ";
            _sql_data.push(_data);
        }
        else if ($.is_array(_data)) {
            var _sql = " (";
            for (var _i = 0; _i < _data.length; _i++) {
                if (_i > 0) {
                    _sql = _sql + " OR ";
                }
                _sql = _sql + " " + _field_name + " = ? ";
                _sql_data.push(_data[_i]);
            }
            _sql = _sql + ") ";
        }
        return {
            "sql": _sql,
            "data": _sql_data
        };
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
        var _callback = $.parse_opt(_opt, "callback");
        
        var _where = _ctl._create_log_where(_opt);

        var _sql = "SELECT id FROM log ";
        if (_where.sql !== undefined && _where.sql !== "") {
            _sql = _sql + " WHERE " + _where.sql;
        }

        $scope.DB.exec(_sql, _where.data, function (_row) {
            $.trigger_callback(_callback, _row.length);
        });
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

    /**
     * 
     * @param {type} _min_time
     * @param {type} _max_time
     * @returns {db_log._ctl.create_timestamp_where_sql.db_logAnonym$3|undefined}
     * 20160316 websql 完美
     */
    _ctl.create_timestamp_where_sql = function (_min_time, _max_time) {
        if (typeof(_min_time) !== "number" && typeof(_max_time) !== "number") {
            return;
        }
        
        var _where_sql = "";
        var _where_data = [];
        if (typeof (_min_time) === "number") {
            _where_sql = _where_sql + " timestamp > ?";
            _where_data.push(_min_time);
        }
        if (typeof (_max_time) === "number") {

            if (_where_sql !== "") {
                _where_sql = _where_sql + " AND ";
            }
            _where_sql = _where_sql + " timestamp < ?";
            _where_data.push(_max_time);
        }
        return {
            "sql": _where_sql,
            "data": _where_data
        };
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
                        //$.console_trace("沒有需要更新");
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
            //return;
            $scope.DB.exec(_sql, [], function (_data) {
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
        $.console_trace("sync_push: " + _server_timestamp);


        // 先準備好要傳過去的資料
        var _sql = "SELECT timestamp, file_name, function_name, qualifier, data "
                + " FROM log WHERE timestamp > ?"
                + " ORDER BY timestamp ASC";
        var _sql_data = [
            _server_timestamp
        ];
        $scope.DB.exec(_sql, _sql_data, function (_logs) {
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
        
        if ($scope.CONFIG.enable_pull === false) {
            return this;
        }
            
        
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
                    + " WHERE file_name = ? AND function_name = ? "
                    + " ORDER BY timestamp DESC limit 1";
            var _sql_data = [
                "db_log.js",
                "sync_complete()"
            ];

            $scope.DB.exec(_sql, _sql_data, function (_row) {
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
            //$.console_trace("sync_init 開始監聽");

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
    // 20160428 移到初始化動作去做
    //_ctl.sync_init();

    // ----------------------------------

    _ctl.get_uuid = function () {
        var _fingerprint = new Fingerprint().get();
        _fingerprint = _fingerprint + _ctl.get_timestamp();
        _fingerprint = $.int_to_letters(_fingerprint);
        return _fingerprint;
//        
//        new Fingerprint2().get(function(_result, _components){
//            console.log(_result);
//            
//            if (typeof(_callback) === "function") {
//                _callback(_result);
//            }
//        });
    };

    // ----------------------------------

    $scope.db_log = _ctl;
};