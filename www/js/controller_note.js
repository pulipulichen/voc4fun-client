var controller_note = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_note.js";

    // ------------------------------

//    var _var = {};
//
//    _var.note = "AAAAAAAAAAAAAAA";
//
//    _ctl.var = _var;

    // ------------------------------

    var _status = {};

    _status.history = [];

    _ctl.status = _status;

    var _status_key = "note";
    _init_status = function () {
        return $scope.db_status.add_listener(
                _status_key,
                function (_s) {
                    _ctl.status = _s;
                    _status = _s;
                },
                function () {
                    return _status;
                });
    };
    _init_status();

    // ------------------------------

    _ctl.enter = function () {
//        _var.note = $scope.ctl_learn_flashcard.var.learn_flashcard.note;
//        $.console_trace(_var.note);
//        $scope.$digest();
        app.navi.pushPage(
                "note.html",
                {"onTransitionEnd": function (_event) {
                        var _textarea = $("#note_html textarea");
                        _ctl._set_auto_grow(_textarea);
                        //alert(_textarea.length);
                        _textarea.focus();
                        _textarea.select();
                    }});
        return this;
    };

    _ctl.auto_grow = function ($event) {
        var _textarea = $($event.target);
        _ctl._set_auto_grow(_textarea);
    };

    _ctl._set_auto_grow = function (_textarea) {
        setTimeout(function () {
            //_textarea.css("padding", "0");
            _textarea.css("height", "auto");
            _textarea.css("height", _textarea.attr("scrollHeight") + "px");
            //$.console_trace("auto_grow: " + _textarea.attr("scrollHeight"));
        }, 0);
    };

    _ctl.copy = function (_note, _uuid) {
        _note = $.trim(_note);
//        _var.note = _note;
        var _textarea = $("#note_html textarea").val(_note);
        _ctl._set_auto_grow(_textarea);
        _textarea.focus();
        
        // 把copy加入log事件
        $scope.log(_log_file, "copy()", _uuid, {
            uuid: _uuid,
            note: _note
        });
    };

    _ctl.submit = function ($event) {
        //alert(1);
//        var _note = _var.note;
        //var _note = $("#note_html textarea").val();
        var _note = $($event.target).parents("ons-page").eq(0).find("textarea.note").val();
        _note = $.trim(_note);

        if (_note !== "" && $scope.ctl_learn_flashcard.var.learn_flashcard.note !== _note) {
            _ctl.save_note_to_db(_note);

            if (_note !== "") {
                _ctl.check_note_edited();
            }
        }

        app.navi.popPage();
        return this;
    };

    _ctl.check_note_edited = function (_id) {
        if (_id === undefined) {
            _id = $scope.ctl_learn_flashcard.get_current_flashcard_id();
        }
        
        if ($.inArray(_id, _status.history) === -1) {
            _status.history.push(_id);

            $scope.db_status.save_status(_status_key);
            //$.console_trace(_status.history);
            $scope.ctl_target.done_plus("take_note");
        }
        
        return this;
    };

    _ctl.save_note_to_db = function (_note) {
        $scope.ctl_learn_flashcard.var.learn_flashcard.note = _note;
        
        var _learn_flashcard = $scope.ctl_learn_flashcard.var.learn_flashcard;
        var _q = _learn_flashcard.q;
        $scope.log(_log_file, "submit()", _q, {
            q: _q,
            a: _learn_flashcard.a,
            note: _learn_flashcard.note
        });
        //$scope.db_status.save_status("learn_flashcard");
        
        var _id = $scope.ctl_learn_flashcard.get_current_flashcard_id();
        //$.console_trace(_id, _note);
        $scope.ctl_flashcard.set_note(_id, _note);
        
        return this;
    };
    
    _ctl.get_noted_count = function () {
        return _status.history.length;
    };

    // -------------------------------

    $scope.ctl_note = _ctl;

};