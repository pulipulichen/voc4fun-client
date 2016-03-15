var controller_note_list = function ($scope) {
    var _ctl = {};
    var _log_file_name = "controller_note_list.js";
    
    // -----------------------------------
    
    var _var = {};
    
    _var.list = [];
    _var.current_index;
    _var.q;
    _var.a;
    _var.note;
    
    _ctl.var = _var;
    
    // -----------------------------------
    
    _ctl.enter = function () {
        $scope.log(_log_file_name, "enter()");
        
        _ctl.init(function () {
            app.navi.replacePage("note_list.html", {
                "animation": "none"
            });
        });
    };
    
    _ctl.init = function (_callback) {
        var _sql = "SELECT MAX(timestamp) AS timestamp , data FROM log "
            //+ " WHERE file_name = 'controller_note.js' AND function_name = 'submit()' "
            + " GROUP BY file_name, function_name, qualifier "
            + " HAVING file_name = ? AND function_name = ? "
            + " ORDER BY timestamp DESC ";
        var _sql_data = [
            'controller_note.js',
            'submit()'
        ];
        $scope.DB.exec(_sql, _sql_data, function (_rows) {
            _var.list = [];
            for (var _i = 0; _i < _rows.length; _i++) {
                _var.list.push($.json_parse(_rows[_i].data));
            }
            //$scope.$digest();
            ons.digest();
            $.trigger_callback(_callback);
        });
    };
    
    //var _note_max_length = 10;
    _ctl.note_abstract = function (_note, _note_max_length) {
        if (_note.length > _note_max_length) {
            _note = _note.substr(0, _note_max_length);
            _note = _note + "...";
        }
        return _note;
    };
    
    _ctl.view = function (_index) {
        _var.current_index = _index;
        _var.q = _var.list[_index].q;
        _var.a = _var.list[_index].a;
        _var.note = _var.list[_index].note;
        
        $scope.log(_log_file_name, "view", _var.q, _var.list[_index]);
//        
//        var _sql = "SELECT id FROM flashcard WHERE q = " + $scope.DB._escape_value(_var.q);
//        $scope.DB.exec(_sql, function (_rows) {
//            _var.flashcard_id = _rows[0].id;
//            
//            app.navi.pushPage("note_list_view.html", {
//                onTransitionEnd: function () {
//                    $scope.ctl_note._set_auto_grow($("#note_list_view_html textarea.note"));
//                }
//            });
//        });
        
        var _flashcard = $scope.ctl_flashcard.find_flashcard(_var.q);
        _var.flashcard_id = _flashcard.id;
            
            app.navi.pushPage("note_list_view.html", {
                onTransitionEnd: function () {
                    $scope.ctl_note._set_auto_grow($("#note_list_view_html textarea.note"));
                }
            });
    };
    
    _ctl.submit = function ($event) {
        var _note = $($event.target).parents("ons-page").eq(0).find("textarea.note").val();
        _var.list[_var.current_index].note = _note;
        
//        var _data = {
//            note: _note
//        };
//        var _where_sql = "q = " + $scope.DB._escape_value(_var.q);
        
        // 儲存到資料庫去
        //$scope.DB.update("flashcard", _data, _where_sql, function () {
        $scope.ctl_flashcard.set_note(_ctl.get_current_flashcard_id(), _note, function () {    
            $scope.log("controller_note.js", "submit()", _var.q, {
                q: _var.q,
                a: _var.a,
                note: _note
            });
            
            //var _id = _var.flashcard_id;
            //$scope.ctl_note.check_note_edited(_id);
            
            //$scope.$digest();
            ons.digest();
            
            app.navi.popPage();
        });
    };
    
    _ctl.get_current_flashcard_id = function () {
        return _var.flashcard_id;
    };
    
    // -----------------------------------
    
    $scope.ctl_note_list = _ctl;
};