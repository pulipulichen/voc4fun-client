/** @global XLSX fase */
var controller_flashcard = function ($scope) {

    var _source_file_name = "data/flashcard.xlsx";

    var _db_name = "flashcard";
    var _db_fields = ["q", "a", "note"];

    $scope.flashcard_setup = function (_callback) {
        // 從xlsx讀取資料

        //$.console_log(typeof(XLSXReader));
        var _create_table = function () {
            $scope.DB.create_table(_db_name, _db_fields, function () {
                XLSX.ajax_loader(_source_file_name, function (_data) {
                    //$.console_log(_data);
                    _status.flashcard_count = _data.length;
                    _data = $.array_shuffle(_data);
                    //$.console_log(_data);
                    $scope.DB.insert(_db_name, _data, _callback);
                });
            });
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
                    $.clone_json(_ctl.status, _s);
                },
                function () {
                    return _ctl.status;
                });
    };
    _status_init();
    
    _ctl.status = _status;
    
    // -----------------------
    
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
    
    // -----------------------
    
    $scope.ctl_flashcard = _ctl;
        
};