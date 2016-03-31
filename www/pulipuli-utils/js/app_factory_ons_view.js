/*global cordova:false */
/*global app:false */
var _app_factory_ons_view = function ($scope) {
    var _log_file = "app_factory_ons_view.js";

    $scope.menu_open = function () {
        $(".onsen-sliding-menu__main").addClass("menu-open");
    };

    $scope.menu_close = function () {
        //$(".onsen-split-view__secondary").css({
        //    "display": "none"
        //})
        $(".onsen-sliding-menu__main").removeClass("menu-open");
    };

    var _exit_app_listeners = [];

    $scope.exit_app = function () {
        for (var _i = 0; _i < _exit_app_listeners.length; _i++) {
            $.trigger_callback(_exit_app_listeners[_i]);
        }
        
        $scope.log(_log_file, "exit_app()");
        
        $scope.sync(function () {
            if (typeof (cordova) !== "undefined") {
                navigator.app.exitApp();
            }
            else {
                window.close();
            }
        });
    };
    // -------------------------

    $scope.main_back = function () {
        if ($(window).width() < 400) {
            if (app.menu.isMenuOpened()) {
                app.menu.close();
            }
            else {
                app.menu.open();
            }
        }
        else {
            $scope.exit_app();
        }
    };

    // -------------------
    $scope.menu_click = function ($event) {
        if ($(window).width() < $scope.CONFIG.small_width) {
            app.menu.close();
        }
        else {
            //$.console_trace("視窗寬度" + $(window).width() + ", 不關閉");
        }
        
        var _text = "setting";
        if (typeof($event.target) === "object") {
            $("#menu_html .menu-active").removeClass("menu-active");
            var _item = $($event.target);
            if (_item.attr("nodeName").toLowerCase() !== "ons-list-item") {
                _item = _item.parents("ons-list-item").eq(0);
            }
            _item.addClass("menu-active");
            
            //alert($event.target.getAttribute("icon"));
            // 加上記錄
            if (_item.find(".menu-label").length > 0) {
                _text = _item.find(".menu-label").text();
                _text = $.trim(_text);
                //alert(1);
            }
            else if (typeof($event.target.getAttribute("icon")) === "string") {
                _text = $event.target.getAttribute("icon");
                //alert(2, _text);
            }
        }
        
        $scope.log(_log_file, "menu_click()", undefined, _text);
    };


    // -------------------

    // 初始化動作，很重要
    if (ons.platform.isWebView()) {
        $("body").addClass("web-view");
    }

    $scope.swipeable_width = 400;

    var _detect_menu_swipeable = function (_force) {
        // This will execute whenever the window is resized
        //$(window).height(); // New height
        var _width = $(window).width(); // New width
        if (_width > _swipeable_width 
                && ( _menu_swipeable === true || _force === true)) {
            _menu_swipeable = false;
            app.menu.setSwipeable(false);
            //$.console_trace("關閉");
        }
        else if (_width < _swipeable_width + 1 
                && (_menu_swipeable === false || _force === true)) {
            _menu_swipeable = true;
            app.menu.setSwipeable(true);
            //$.console_trace("開啟");
        }

        if (app.menu.isMenuOpened()) {
            app.menu.close();
        }
    };

    var _swipeable_width = $scope.swipeable_width;
    var _menu_swipeable = true;
    $scope.setup_menu_swipeable = function () {
        $(window).resize(_detect_menu_swipeable);
        _detect_menu_swipeable();
    };

    /**
     * 設定退回的事件
     * @param {function} _callback
     */
    $scope.setup_back_hotkey = function (_callback) {

        $(document).keyup(function (_event) {
            //alert(_event.keyCode);
            if (_event.keyCode === 27) {
                // 好吧，我也不確定
                //document.backbutton();
                $.trigger_callback(_callback);
            }
        });
    };

    $scope.set_swipeable = function (_swipeable) {
        var _body = $("body");
        var _classname = "main-full";
        if (_swipeable === false) {
            _body.addClass(_classname);
            app.menu.setSwipeable(_swipeable);
        }
        else {
            _detect_menu_swipeable(true);
            _body.removeClass(_classname);
        }
        return this;
    };

    ons.ready(function () {
        //$.console_trace("有設定");
        $scope.setup_menu_swipeable();
        $scope.setup_back_hotkey(document.backbutton);
    });

    // --------------------------------

    var _ctl = {};

    /**
     * @TODO 20151127 轉變特效失敗 #46
     * @param {JSON} _opt
     */
    _ctl.transition_next = function (_opt) {
        var _page = $.parse_opt(_opt, "page");
        var _trans_page = $.parse_opt(_opt, "trans_page");
        var _set_trans_page = $.parse_opt(_opt, "set_trans_page");
        var _set_page = $.parse_opt(_opt, "set_page");
        var _animation = $.parse_opt(_opt, "animation", "lift");
        var _callback = $.parse_opt(_opt, "callback");

        $.trigger_callback(_set_trans_page);


        app.navi.replacePage(_trans_page, {
            "animation": _animation,
            "onTransitionEnd": function () {
                $.trigger_callback(_set_page);
                app.navi.replacePage(_page, {
                    "animation": "none",
                    "onTransitionEnd": _callback
                });
            }
        });


        setTimeout(function () {
            //$scope.$digest();
        }, 500);
    };

    /**
     * @TODO 20151127 轉變特效失敗 #46
     * @param {JSON} _opt
     */
    _ctl.transition_prev = function (_opt) {
        var _page = $.parse_opt(_opt, "page");
        var _trans_page = $.parse_opt(_opt, "trans_page");
        var _set_trans_page = $.parse_opt(_opt, "set_trans_page");
        var _set_page = $.parse_opt(_opt, "set_page");
        var _animation = $.parse_opt(_opt, "animation", "lift");
        var _callback = $.parse_opt(_opt, "callback");

        $.trigger_callback(_set_trans_page);

        app.navi.pushPage(_trans_page, {
            "animation": "none",
            "onTransitionEnd": function () {
                //$.trigger_callback(_set_page);
                //$scope.$digest();
                app.navi.popPage({
                    "animation": _animation,
                    "onTransitionEnd": _callback
                });
            }
        });
        setTimeout(function () {
            $.trigger_callback(_set_page);
            $scope.$digest();
        }, 100);
    };

    /**
     * 讓menu保持在點選的狀態
     * @param {number} _index
     */
    _ctl.active_menu = function (_index) {
        var _classname = "menu-active";
        $("#menu_html .menu-active").removeClass(_classname);
        var _menu_item = $("#menu_html ons-list-item");
        //$.console_trace("active_menu", _menu_item.length);
        if (_index < _menu_item.length) {
            _menu_item.eq(_index).addClass(_classname);
        }
    };
    
    _ctl.exit_app_add_listener = function (_evt) {
        if (typeof(_evt) === "function") {
            _exit_app_listeners.push(_evt);
        }
    };

    // -------------------------------

    $scope.ons_view = _ctl;
};
