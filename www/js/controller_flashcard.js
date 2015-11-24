var controller_flashcard = function ($scope) {

    var _source_file_name = "data/flashcard.xlsx";

    var _db_name = "flashcard";
    var _db_fields = [
        "q", "a"
    ];

    $scope.flashcard_setup = function () {
        // 從xlsx讀取資料

        //$.console_log(typeof(XLSXReader));
        $scope.DB.create_table(_db_name, _db_fields, function () {
            $scope._load_xlsx(_source_file_name, function (_data) {
                //$.console_log(_data);
                _data = $.array_shuffle(_data);
                $scope.DB.insert(_db_name, _data, function () {
                    $.console_log(_data);
                });
            });
        });

    };

    $scope._load_xlsx = function (_source_file_name, _callback) {
        /* set up XMLHttpRequest */
        var url = _source_file_name;
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (e) {
            var arraybuffer = oReq.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i !== data.length; ++i)
                arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLSX */
            var workbook = XLSX.read(bstr, {type: "binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];

            var _result = [];
            var _is_first_row = 0;
            var _key;
            for (z in worksheet) {
                /* all keys that do not begin with "!" correspond to cell addresses */
                if (z[0] === '!') {
                    continue;
                }
                if (_is_first_row < 2) {
                    _is_first_row++;
                    continue;
                }
                var _v = worksheet[z].v;
                _v = $.trim(_v);
                if (_key === undefined) {
                    _key = _v;
                }
                else {
                    _result.push({
                        q: _key,
                        a: _v
                    });
                    _key = undefined;
                }
            }

            _callback(_result);
            //$.console_log(worksheet);
            /* DO SOMETHING WITH workbook HERE */
        };
        oReq.send();
    };
};