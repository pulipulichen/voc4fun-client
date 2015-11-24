var _app_factory_db_utils = function ($scope) {
    $scope.DB = {
        db: null,
        open_db: function () {
            this.db = openDatabase('open_database', '1.0', 'Pulipuli Open Database', 2 * 1024 * 1024);
            //console.log(typeof(_DB.transaction));
            return this;
        },
        create_table: function (_table_name, _field_name_list, _success_callback) {
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
        },
        drop_table: function (_table_name, _success_callback) {
            var _sql = 'DROP TABLE ' + _table_name;
            this.exec(_sql, _success_callback);
            return this;
        },
        empty_table: function (_table_name, _success_callback) {
            var _sql = 'DELETE FROM ' + _table_name;
            this.exec(_sql, _success_callback);
            return this;
        },
        table_exists: function (_table_name, _success_callback) {
            if (typeof(_success_callback) !== "function") {
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
        },
        exec: function (_sql, _success_callback) {
            var _ = this;
            console.log(_sql);
            this.db.transaction(function (_tx) {
                _tx.executeSql(_sql, [], function (_tx, _results) {
                    if (typeof (_success_callback) === "function") {
                        _success_callback(_results.rows);
                    }
                }, function (_tx, _error) {
                    _.error_handler(_tx, _error, _sql);
                });
            });
            return this;
        },
        insert: function (_table, _data, _success_callback) {
            var _data_sql = $scope.DB._encode_data_sql(_data);
            
            var _sql = 'INSERT INTO ' + _table 
                    + ' (' + _data_sql.field + ')'
                    + ' VALUES (' + _data_sql.value + ')';
            
            // @TODO 需要增加取得剛剛新增資料的方法？不用好了
            $scope.DB.exec(_sql, _success_callback);
        },
        update: function (_table, _data, _where_sql, _success_callback) {
            var _set_sql = '';
            for (var _field in _data) {
                if (_set_sql !== '') {
                    _set_sql = _set_sql + ",";
                }
                
                var _value = _data[_field];
                if (typeof(_value) !== "number") {
                    _value = "'" + _value + "'";
                }
                _set_sql = _set_sql + _field + " = " + _value;
            }
            
            var _sql = 'UPDATE ' + _table 
                    + ' SET ' + _set_sql
                    + ' WHERE ' + _where_sql;
            
            $scope.DB.exec(_sql, _success_callback);
            return this;
        },
        insert_or_update: function (_table, _data, _where_sql, _success_callback) {
            // 先根據where_sql找找看筆數
            var _sql = "SELECT id FROM " + _table 
                    + " WHERE " + _where_sql;
            $scope.DB.exec(_sql, function (_results) {
                console.log("result");
                console.log(_results);
                if (_results.length > 0) {
                    var _id = _results[0].id;
                    $scope.DB.update(_table, _data, _where_sql, _success_callback);
                }
                else {
                    $scope.DB.insert(_table, _data, _success_callback);
                }
            });
            return this;
        },
        insert_or_update_one: function (_table, _data, _success_callback) {
            return $scope.DB.insert_or_update(_table, _data, 
                'id = 1',
                _success_callback);
        },
        count: function (_table, _where_sql, _success_callback) {
            if (typeof(_success_callback) !== "function") {
                return this;
            }
            var _sql = "SELECT id FROM " + _table 
                    + " WHERE " + _where_sql;
            $scope.DB.exec(_sql, function (_results) {
                if (typeof(_success_callback) === "function") {
                    _success_callback(_results.length);
                }
            });
            return this;
        },
        _encode_data_sql: function (_data) {
            var _field_sql = "";
            var _value_sql = "";
            
            //console.log(_data);
            for (var _field in _data) {
                var _value = _data[_field];
                if (typeof(_value) === "undefined") {
                    continue;
                }
                
                if (_field_sql !== "") {
                    _field_sql = _field_sql + ",";
                    _value_sql = _value_sql + ",";
                }
                
                _field_sql = _field_sql + _field;
                if (typeof(_value) === "number") {
                    _value_sql = _value_sql + _value;
                }
                else {
                    _value_sql = _value_sql + "'" + _value + "'";
                }
            }
            return {
                field: _field_sql,
                value: _value_sql
            };
        },
        error_handler: function (_tx, _error, _sql) {
            console.log("Database Error: " + _error.message + " in SQL: " + _sql);
        }
    };
};