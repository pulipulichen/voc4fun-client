var controller_note = function ($scope) {

    var _ctl = {};

    var _log_file = "controller_note.js";

    // ------------------------------

    _ctl.enter = function () {
        app.navi.pushPage(
                "note.html",
                {"onTransitionEnd": function () {
                        var _textarea = $("#note_html textarea");
                        $.console_trace(_textarea.length);
                        _textarea.css("height", "auto");
                        _textarea.css("height", _textarea.attr("scrollHeight") + "px");
                    }});
    };

    _ctl.auto_grow = function ($event) {
        var _textarea = $($event.target);
        setTimeout(function () {
            //_textarea.css("padding", "0");
            _textarea.css("height", "auto");
            _textarea.css("height", _textarea.attr("scrollHeight") + "px");
            $.console_trace("auto_grow: " + _textarea.attr("scrollHeight"));
        }, 0);
    };

    // -------------------------------

    $scope.ctl_note = _ctl;

};