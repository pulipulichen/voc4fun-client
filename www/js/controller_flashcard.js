/** @global XLSX fase */
var controller_flashcard = function ($scope) {

    var _source_file_name = "data/flashcard.xlsx";

    var _db_name = "flashcard";
    var _db_fields = ["q", "a", "note"];
    
    // -----------------------
    
    var _ctl = {};
    
    // -----------------------
    
    var _status = {};
    
    _status.flashcard_count = 0;
    
    // 註冊
    var _status_key = "flashcard";
    var _status_init = function () {
        return $scope.db_status.add_listener(
                _status_key,
                function (_s) {
                    _ctl.status = _s;
                    _status = _s;
                },
                function () {
                    return _ctl.status;
                });
    };
    _status_init();
    
    _ctl.status = _status;
    
    // -----------------------
    
    $scope.DB.register_table(_db_name, _db_fields);
    _ctl.setup = function (_callback) {
        // 從xlsx讀取資料

        //$.console_log(typeof(XLSXReader));
        var _create_table = function () {
            //$scope.DB.create_table(_db_name, _db_fields, function () {
            //$scope.DB.register_table(_db_name, _db_fields, function () {
                XLSX.ajax_loader(_source_file_name, function (_data) {
                    //$.console_log(_data);
                    _status.flashcard_count = _data.length;
                    $scope.db_status.save_status(_status_key);
                    _data = $.array_shuffle(_data);
                    //$.console_log(_data);
                    $scope.DB.insert(_db_name, _data, _callback);
                });
            //});
        };
            
        $scope.DB.table_exists(_db_name, function (_result) {
            if (_result === true) {
                //$.console_trace("已經建立了");
                $.trigger_callback(_callback);
            }
            else {
                _create_table();
            }
        });
    };
    
    _ctl.get_flashcard = function(_id, _callback) {
        var _sql = "SELECT * FROM flashcard WHERE id = " + _id;
        $scope.DB.exec(_sql, function (_data) {
            var _flashcard;
            if (_data.length > 0) {
                _flashcard = _data[0];
            }
            $.trigger_callback(_callback, _flashcard);
        });
    };
    
    _ctl.get_other_flashcards = function (_exclude_id, _length, _callback) {
        
        var _other_cards = [];
        
        var _random_index = [];
        var _max_index = _status.flashcard_count - 1;
        
        if (_max_index > _length) {
            while (_random_index.length < _length) {
                var _i = Math.floor(Math.random() * _max_index);
                
                while ($.inArray(_i, _random_index) !== -1) {
                    _i++;
                    if (_i === _max_index) {
                        _i = 0;
                    }
                }
                
                _random_index.push(_i);
            }
        }
        else {
            for (var _i = 0; _i < _max_index; _i++) {
                _random_index.push(_i + 1);
            }
        }
        
        //_random_index = [0, 5];
        //$.console_trace("random_index", _random_index);
        
        var _loop = function (_i) {
            if (_i < _random_index.length) {
                var _sql = "SELECT * FROM flashcard WHERE id != " + _exclude_id + " LIMIT " + _random_index[_i] + ", 1";
                $scope.DB.exec(_sql, function (_row) {
                    _other_cards.push(_row[0]);
                    _i++;
                    _loop(_i);
                });
            }
            else {
                $.trigger_callback(_callback, _other_cards);
            }
        };
        
        _loop(0);
    };
    
    // -----------------------
    
    _ctl.set_note = function (_id, _note, _callback) {
        var _data = {
            note: _note
        };
        var _where_sql = 'id = ' + _id;
        
        $scope.DB.update(_db_name, _data, _where_sql, _callback);
    };
    
    // -----------------------
    
    $scope.ctl_flashcard = _ctl;
        
};