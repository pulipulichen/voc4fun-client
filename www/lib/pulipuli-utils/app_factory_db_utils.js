var _app_factory_db_utils = function ($scope) {
    $scope.DB = {};
    $scope.DB.db = null;

    $scope.DB.open_db = function () {
        this.db = openDatabase('open_database', '1.0', 'Pulipuli Open Database', 2 * 1024 * 1024);
        //console.log(typeof(_DB.transaction));
        return this;
    };
    $scope.DB.create_table = function (_table_name, _field_name_list, _success_callback) {
        var _sql = "CREATE TABLE IF NOT EXISTS " + _table_name + " (";

        _sql = _sql + "id INTEGER PRIMARY KEY, ";

        for (var _i in _field_name_list) {
            var _field_name = _field_name_list[_i];
            _sql = _sql + _field_name;
            if (_i < _field_name_list.length - 1) {
                _sql = _sql + ",";
            }
        }
        _sql = _sql + ")";
        this.exec(_sql, _success_callback);
        return this;
    };

    $scope.DB.drop_table = function (_table_name, _success_callback) {
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
            return $scope.DB.table_exists(_table_name, function (_exists) {
                if (_exists === true) {
                    var _sql = 'DROP TABLE ' + _table_name;
                    $scope.DB.exec(_sql, _success_callback);
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
                $scope.DB.exec(_sql, _success_callback);
            }
            else {
                $.trigger_callback(_success_callback);
            }
        });
    };

    $scope.DB.table_exists = function (_table_name, _success_callback) {
        if (typeof (_success_callback) !== "function") {
            return this;
        }
        var _ = this;
        var _sql = "select * from " + _table_name + " limit 0, 1";
        this.db.transaction(function (_tx) {
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

    $scope.DB.exec = function (_sql, _success_callback) {
        var _ = this;
        console.log(_sql);
        this.db.transaction(function (_tx) {
            _tx.executeSql(_sql, [], function (_tx, _results) {
                if (typeof (_success_callback) === "function") {
                    var _data = [];
                    for (var _r = 0; _r < _results.rows.length; _r++) {
                        var _row = _results.rows[_r];
                        var _d = {};
                        for (var _c in _row) {
                            var _value = _row[_c];
                            _value = $.unescape_quotation(_value);
                            _d[_c] = _value;
                        }
                        _data.push(_d);
                    }
                    ;
                    _success_callback(_data);
                }
            }, function (_tx, _error) {
                _.error_handler(_tx, _error, _sql);
            });
        });
        return this;
    };
    $scope.DB.insert = function (_table, _data, _success_callback) {
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

        var _data_sql = $scope.DB._encode_data_sql(_data);

        var _sql = 'INSERT INTO ' + _table
                + ' (' + _data_sql.field + ')'
                + ' VALUES (' + _data_sql.value + ')';

        // @TODO 需要增加取得剛剛新增資料的方法？不用好了
        $scope.DB.exec(_sql, _success_callback);
        return this;
    };
    $scope.DB.update = function (_table, _data, _where_sql, _success_callback) {
        var _set_sql = '';
        for (var _field in _data) {
            if (_set_sql !== '') {
                _set_sql = _set_sql + ",";
            }

            var _value = _data[_field];
            _value = $scope.DB._escape_value(_value);
            _set_sql = _set_sql + _field + " = " + _value;
        }

        var _sql = 'UPDATE ' + _table
                + ' SET ' + _set_sql
                + ' WHERE ' + _where_sql;

        $scope.DB.exec(_sql, _success_callback);
        return this;
    };
    $scope.DB.insert_or_update = function (_table, _data, _where_sql, _success_callback) {
        // 先根據where_sql找找看筆數
        var _sql = "SELECT id FROM " + _table
                + " WHERE " + _where_sql;
        $scope.DB.exec(_sql, function (_results) {
            //console.log("result");
            //console.log(_results);
            if (_results.length > 0) {
                var _id = _results[0].id;
                $scope.DB.update(_table, _data, _where_sql, _success_callback);
            }
            else {
                $scope.DB.insert(_table, _data, _success_callback);
            }
        });
        return this;
    };
    $scope.DB._escape_value = function (_value) {
        if (typeof (_value) !== "number") {
            //_value = "'" + $.addslashes(_value) + "'";
            _value = "'" + $.escape_quotation(_value) + "'";
        }
        return _value;
    };
    $scope.DB.insert_or_update_one = function (_table, _data, _success_callback) {
        return $scope.DB.insert_or_update(_table, _data,
                'id = 1',
                _success_callback);
    };
    $scope.DB.count = function (_table, _where_sql, _success_callback) {
        return $scope.DB.table_exists(_table, function (_exists) {
            if (_exists === false) {
                return $.trigger_callback(_success_callback, 0);
            }

            if (typeof (_where_sql) === "function") {
                _success_callback = _where_sql;
                _where_sql = "";
            }
            if (typeof (_where_sql) === "string" && _where_sql !== "") {
                _where_sql = " WHERE " + _where_sql;
            }
            var _sql = "SELECT id FROM " + _table + _where_sql;
            return $scope.DB.exec(_sql, function (_results) {
                $.trigger_callback(_success_callback, _results.length);
            });
        });
    };
    $scope.DB._encode_data_sql = function (_data) {
        var _field_sql = "";
        var _value_sql = "";

        //console.log(_data);
        for (var _field in _data) {
            var _value = _data[_field];
            if (typeof (_value) === "undefined") {
                continue;
            }

            if (_field_sql !== "") {
                _field_sql = _field_sql + ",";
                _value_sql = _value_sql + ",";
            }

            _field_sql = _field_sql + _field;
            _value = $scope.DB._escape_value(_value);
            _value_sql = _value_sql + _value;
        }
        return {
            field: _field_sql,
            value: _value_sql
        };
    };
    $scope.DB.error_handler = function (_tx, _error, _sql) {
        //console.log("Database Error: " + _error.message + " in SQL: " + _sql);
        $.console_trace("Database Error: " + _error.message + " in SQL: " + _sql);
    };

    $scope.DB.get = function (_table_name, _callback) {
        var _sql = "SELECT * from " + _table_name;
        return $scope.DB.exec(_sql, _callback);
    };
};