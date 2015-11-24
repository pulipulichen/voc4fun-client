/** @global XLSX fase */
var controller_flashcard = function ($scope) {

    var _source_file_name = "data/flashcard.xlsx";

    var _db_name = "flashcard";
    var _db_fields = [
        "q", "a"
    ];

    $scope.flashcard_setup = function (_callback) {
        // 從xlsx讀取資料

        //$.console_log(typeof(XLSXReader));
        $scope.DB.create_table(_db_name, _db_fields, function () {
            XLSX.ajax_loader(_source_file_name, function (_data) {
                //$.console_log(_data);
                _data = $.array_shuffle(_data);
                //$.console_log(_data);
                $scope.DB.insert(_db_name, _data, _callback);
            });
        });

    };
        
};