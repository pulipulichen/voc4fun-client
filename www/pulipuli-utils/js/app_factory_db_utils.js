var _app_factory_db_utils = function ($scope) {
    $scope.DB = {};
    var _db;
    
    var _db_checked = false;

    var _init_db = function () {
        
        //$.console_trace("var _init_db = function () {");
        //throw "var _init_db = function () {";
        //return;
        //alert(!window.openDatabase);
        if (_db_checked === true) {
            return;
        }
        
        if (_db === undefined) {
            try {
                _db = openDatabase('open_database', '1.0', 'Pulipuli Open Database', 2 * 1024 * 1024 );
                //$.console_trace("finish");
            }
            catch (_error) {
                //$.console_trace("finish1");
                $.console_trace("OpenDatabase Error", _error.message);
                _db_checked = true;
                alert("資料庫初始化失敗，不能使用");
            }
            //alert(typeof(_db.transaction));
            
            //console.log(typeof(_db.transaction));
        }
        return _db;
    };

    var _register_data = {};

    /**
     * 註冊
     * @param {String} _table 表格名稱
     * @param {String[]} _fields 欄位名稱
     */
    $scope.DB.register_table = function (_table, _fields, _callback) {
        _register_data[_table] = _fields;
        $.trigger_callback(_callback);
        return this;
    };

    // ----------------------------------

    $scope.DB.exec = function (_sql, _data, _success_callback) {

        //$.console_trace("exec", _sql);
        //return;
        //alert(_sql);
        if (typeof (_sql) !== "string") {
            $.console_trace("$scope.DB.exec error: _sql is not string");
            return;
        }

        _init_tables(function () {
            _db.transaction(function (_tx) {
                //alert("完成1");
                //$.console_trace("表格建好了，準備執行");
                _tx.executeSql(_sql, _data, function (_tx, _results) {
                    //alert("完成2");
                    if (typeof (_success_callback) === "function") {
                        var _data = [];
                        for (var _r = 0; _r < _results.rows.length; _r++) {
                            //if (typeof(_results.rows.item))
                            //var _row = _results.rows[_r];
                            var _row = _results.rows.item(_r);
                            //alert(JSON.stringify(_row));
                            //return;
                            var _d = {};
                            for (var _c in _row) {
                                var _value = _row[_c];
                                _value = $.unescape_quotation(_value);
                                _d[_c] = _value;
                            }
                            _data.push(_d);
                        }
                        
                        _success_callback(_data);
                    }
                }, function (_tx, _error) {
                    $scope.DB.error_handler(_tx, _error, _sql);
                });
            });
            //alert("完成1a");
        });
        return this;
    };

    // ----------------------------------

    var _tables_inited = false;

    var _init_tables = function (_callback) {
        //$.console_trace("_init_tables()");
        //return;
        
        if (_tables_inited === false) {
            //$.console_trace("before _init_db();");
            _init_db();
            //$.console_trace("_init_db();");
            var _keys = $.array_keys(_register_data);
            
            //$.console_trace("_init_tables", _keys);
            var _loop = function (_i) {
                if (_i < _keys.length) {
                    var _table_name = _keys[_i];
                    var _fields = _register_data[_table_name];
                    //$.console_trace("before $scope.DB.create_table(_table_name, _fields, function () {");
                    $scope.DB.create_table(_table_name, _fields, function () {
                        //$.console_trace("after $scope.DB.create_table(_table_name, _fields, function () {");
                        _i++;
                        _loop(_i);
                    });
                }
                else {
                    _tables_inited = true;
                    //$.console_trace("1a");
                    $.trigger_callback(_callback);
                }
            };
            _loop(0);
        }
        else {
            //$.console_trace("1b");
            $.trigger_callback(_callback);
        }
    };

    // ----------------------------------

    $scope.DB.create_table = function (_table_name, _field_name_list, _success_callback) {
        //$.console_trace("$scope.DB.create_table");
        //return;
        var _sql = "CREATE TABLE IF NOT EXISTS " + _table_name + " (";

        //_sql = _sql + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ";
        _sql = _sql + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ";

        for (var _i in _field_name_list) {
            var _field_name = _field_name_list[_i];
            _sql = _sql + _field_name;
            if (_i < _field_name_list.length - 1) {
                _sql = _sql + ",";
            }
        }
        _sql = _sql + ")";
        //$scope.DB.exec(_sql, _success_callback);
        //$.console_trace("create table_name", _table_name);
        _init_db();
        
        //$.console_trace("before _db.transaction(function (_tx) {");
        _db.transaction(function (_tx) {
            //alert("table 1");
            //$.console_trace("before _tx.executeSql(_sql, [], _success_callback);");
            var _error_handler = function (_tx, _error) {
                //alert(_error);
                
                // 如果建立table失敗，那就失敗吧，應該有記得吧？
                //$scope.DB.error_handler(_tx, _error, _sql);
            };
            
            _tx.executeSql(_sql, [], _success_callback, _error_handler);
        });
        return this;
    };

    $scope.DB.drop_table = function (_table_name, _success_callback) {
        _tables_inited = false;
        if ($.is_array(_table_name)) {
            var _loop = function (_i) {
                if (_i < _table_name.length) {
                    $scope.DB.drop_table(_table_name[_i], function () {
                        _i++;
                        _loop(_i);
                    });
                }
                else {
                    $.trigger_callback(_success_callback);
                }
            };
            _loop(0);
            return this;
        }
        else {
            //$.console_trace("drop_table", _table_name);
            _init_db();
            return $scope.DB.table_exists(_table_name, function (_exists) {
                if (_exists === true) {
                    var _sql = 'DROP TABLE ' + _table_name;
                    //$scope.DB.exec(_sql, _success_callback);
                    _db.transaction(function (_tx) {
                        _tx.executeSql(_sql, [], _success_callback);
                    });
                }
                else {
                    $.trigger_callback(_success_callback);
                }
            });
        }
    };

    $scope.DB.empty_table = function (_table_name, _success_callback) {
        return $scope.DB.table_exists(_table_name, function (_exists) {
            if (_exists === true) {
                var _sql = 'DELETE FROM ' + _table_name;
                $scope.DB.exec(_sql, [], _success_callback);
            }
            else {
                $.trigger_callback(_success_callback);
            }
        });
    };

    $scope.DB.table_exists = function (_table_name, _success_callback) {
        //$.console_trace("$scope.DB.table_exists()");
        //return;
        if (typeof (_success_callback) !== "function") {
            return this;
        }
        var _ = this;
        var _sql = "SELECT id FROM " + _table_name + " LIMIT 0, 1";
        _init_db();
        _db.transaction(function (_tx) {
            _tx.executeSql(_sql, [], function (_tx, _results) {
                if (typeof (_success_callback) === "function") {
                    _success_callback(true);
                }
            }, function (_tx, _error) {
                _success_callback(false);
            });
        });
        return this;
    };

    $scope.DB.row_exists = function (_table_name, _callback) {
        //$.console_trace("$scope.DB.row_exists()");
        //return;
        return $scope.DB.table_exists(_table_name, function (_exists) {
            if (_exists === false) {
                $.trigger_callback(_callback, false);
            }
            //$.console_trace("row_exists");
            $scope.DB.count(_table_name, function (_count) {
                //$.console_trace("row_exists $scope.DB.count", _count);
                $.trigger_callback(_callback, (_count > 0));
            });
        });
    };

    /**
     * 
     * @param {type} _table
     * @param {type} _data
     * @param {type} _success_callback
     * @returns {_app_factory_db_utils.$scope.DB}
     * 20160316 websql 完美 
     */
    $scope.DB.insert = function (_table, _data, _success_callback) {
        //$.console_trace("insert()", _data);
        //throw "insert()";
        //return;
        if ($.is_array(_data)) {
            var _loop = function (_i) {
                if (_i < _data.length) {
                    $scope.DB.insert(_table, _data[_i], function () {
                        _i++;
                        _loop(_i);
                    });
                }
                else {
                    $.trigger_callback(_success_callback);
                }
            };
            _loop(0);
            return this;
        }

//        var _data_sql = $scope.DB._encode_data_sql(_data);
//
////        var _sql = 'INSERT INTO ' + _table
////                + ' (' + _data_sql.field + ')'
////                + ' VALUES (' + _data_sql.value + ')';
//        var _sql = 'INSERT INTO ' + _table
//                + ' (' + _data_sql.field + ')'
//                + ' VALUES (?)';
//        var _sql_data = _data_sql.value;
        var _field_sql = "";
        var _value_sql = "";
        var _data_array = [];
        for (var _field in _data) {
            var _value = _data[_field];
            
            if (_field_sql !== "") {
                _field_sql = _field_sql + ", ";
                _value_sql = _value_sql + ", ";
            }
            _field_sql = _field_sql + _field;
            _value_sql = _value_sql + "?";
            _data_array.push(_value);
        }
        
        var _sql = "INSERT INTO " + _table 
                + " (" + _field_sql + ") "
                + " VALUES (" + _value_sql + ")";

        // @TODO 需要增加取得剛剛新增資料的方法？不用好了
        //alert(_sql);
        $scope.DB.exec(_sql, _data_array, _success_callback);
        return this;
    };
    
    /**
     * 
     * @param {type} _table
     * @param {type} _data
     * @param {type} _where_data
     * @param {type} _success_callback
     * @returns {_app_factory_db_utils.$scope.DB}
     * 20160316 非常完美
     */
    $scope.DB.update = function (_table, _data, _where_data, _success_callback) {
        var _set_sql = '';
        var _data = [];
        
        for (var _field in _data) {
            if (_set_sql !== '') {
                _set_sql = _set_sql + ",";
            }

            var _value = _data[_field];
            _value = $scope.DB._escape_value(_value);
            _set_sql = _set_sql + _field + " = ?";
            _data.push(_value);
        }
        
        var _where_sql = _encode_where_data_sql(_where_data);
        var _where_data_ary = _extract_where_data(_where_data);
        _data = $.array_append(_data, _where_data_ary);

        var _sql = 'UPDATE ' + _table
                + ' SET ' + _set_sql
                + ' WHERE ' + _where_sql;

        $scope.DB.exec(_sql, _data, _success_callback);
        return this;
    };
    
    /**
     * 
     * @param {type} _table
     * @param {type} _data
     * @param {type} _where_data = {
     *      "field": "value"
     * };
     * @param {type} _success_callback
     * 
     * 20160316 修改完成，非常完美
     */
    $scope.DB.insert_or_update = function (_table, _data, _where_data, _success_callback) {
//        // 先根據where_sql找找看筆數
//        var _data_sql = $scope.DB._encode_data_sql(_data);
//        
//        var _where_sql = "";
//        for (var _i = 0; _i < _data_sql.value.length; _i++) {
//            if (_where_sql !== "") {
//                _where_sql = _where_sql + ",";
//            }
//            _where_sql = _where_sql + _data_sql.field_ary[_i] + " = ?";
//        }
//        var _sql = "SELECT id FROM " + _table
//                + " WHERE " + _where_sql;
//        $scope.DB.exec(_sql, _data_sql.value, function (_results) {
//            //console.log("result");
//            //console.log(_results);
//            if (_results.length > 0) {
//                var _id = _results[0].id;
//                $scope.DB.update(_table, _data, _where_sql, _success_callback);
//            }
//            else {
//                $scope.DB.insert(_table, _data, _success_callback);
//            }
//        });
//        return this;
        
        
        // step 1. 找出有where條件下的資料
        var _sql = _encode_select_sql(_table, ["id"], _where_data);
        var _data_array = _extract_where_data(_where_data);
        
        $scope.DB.exec(_sql, _data_array, function (_results) {
            if (_results.length > 0) {
                var _id = _results[0].id;
                $scope.DB.update(_table, _data, _where_data, _success_callback);
            }
            else {
                $scope.DB.insert(_table, _data, _success_callback);
            }
        });
    };
    
    /**
     * 
     * @param {type} _table
     * @param {type} _fields
     * @param {type} _where_data
     * @returns {String}
     * 20160316 websql 完美
     */
    var _encode_select_sql = function (_table, _fields, _where_data) {
        var _field_sql = "";
        for (var _f = 0; _f < _fields.length; _f++) {
            if (_field_sql !== "") {
                _field_sql = _field_sql + ",";
            }
            _field_sql = _field_sql + _fields[_f];
        }
        var _where_sql = _encode_where_data_sql(_where_data);
        if (_where_sql !== "") {
            _where_sql = " WHERE " + _where_sql;
        }
        
        var _sql = "SELECT " + _field_sql + " FROM " + _table + _where_sql;
        return _sql;
    };
    
    /**
     * 
     * @param {type} _where_data
     * @returns {String}
     * 20160316 websql 完美
     */
    var _encode_where_data_sql = function (_where_data) {
        var _where_sql = "";
        for (var _key in _where_data) {
            if (_where_sql !== "") {
                _where_sql = _where_sql + " AND ";
            }
            _key = $.trim(_key);
            if (_key.indexOf("=") === -1) {
                _key = _key + " = ";
            }
            _where_sql = _where_sql + _key + "?";
        }
        return _where_sql;
    };
    
    /**
     * 
     * @param {type} _where_data
     * @returns {_app_factory_db_utils._extract_where_data._ary|Array}
     * 20160316 websql 完美
     */
    var _extract_where_data = function (_where_data) {
        var _ary = [];
        for (var _key in _where_data) {
            _ary.push(_where_data[_key]);
        }
        return _ary;
    };
    
    /**
     * 
     * @param {type} _value
     * @returns {String}
     */
    $scope.DB._escape_value = function (_value) {
        if (typeof (_value) !== "number") {
            //_value = "'" + $.addslashes(_value) + "'";
            _value = "'" + $.escape_quotation(_value) + "'";
        }
        return _value;
    };
    
    
//    $scope.DB.insert_or_update_one = function (_table, _data, _success_callback) {
//        return $scope.DB.insert_or_update(_table, _data,
//                'id = 1',
//                _success_callback);
//    };
    
    /**
     * 
     * @param {type} _table
     * @param {type} _where_data
     * @param {type} _success_callback
     * @returns {_app_factory_db_utils.$scope.DB}
     * 20160316 非常完美
     */
    $scope.DB.count = function (_table, _where_data, _success_callback) {
        if (typeof (_where_data) === "function") {
            _success_callback = _where_data;
            _where_data = {};
        }
        
        return $scope.DB.table_exists(_table, function (_exists) {
            if (_exists === false) {
                return $.trigger_callback(_success_callback, 0);
            }

            
            //if (typeof (_where_sql) === "string" && _where_sql !== "") {
            //    _where_sql = " WHERE " + _where_sql;
            //}
            //var _sql = "SELECT id FROM " + _table + _where_sql;
            var _sql = _encode_select_sql(_table, ['id'], _where_data);
            var _where_data_ary = _extract_where_data(_where_data);
            
            return $scope.DB.exec(_sql, _where_data_ary, function (_results) {
                $.trigger_callback(_success_callback, _results.length);
            });
        });
    };
    
//    $scope.DB._encode_data_sql = function (_data) {
//        var _field_sql = "";
//        var _field_ary = [];
//        var _value_ary = [];
//
//        //console.log(_data);
//        for (var _field in _data) {
//            var _value = _data[_field];
//            if (typeof (_value) === "undefined") {
//                continue;
//            }
//
//            if (_field_sql !== "") {
//                _field_sql = _field_sql + ",";
//                //_value_sql = _value_sql + ",";
//            }
//
//            _field_sql = _field_sql + _field;
//            _field_ary.push(_field);
//            _value = $scope.DB._escape_value(_value);
//            //_value_sql = _value_sql + _value;
//            _value_ary.push(_value);
//        }
//        return {
//            field: _field_sql,
//            field_ary: _field_ary,
//            value: _value_ary
//        };
//    };
    
    $scope.DB.error_handler = function (_tx, _error, _sql) {
        //console.log("Database Error: " + _error.message + " in SQL: " + _sql);
        var _msg = "Database Error: " + _error.message + " in SQL: " + _sql;
        alert(_msg);
        $.console_trace(_msg);
    };

    /**
     * @param {type} _table_name
     * @param {type} _callback
     * @returns {_app_factory_db_utils.$scope.DB|undefined}
     * 20160316 沒有需要變更的地方
     */
    $scope.DB.get = function (_table_name, _callback) {
        var _sql = "SELECT * from " + _table_name;
        //$.console_trace(_sql);
        return $scope.DB.exec(_sql, [], _callback);
    };
};