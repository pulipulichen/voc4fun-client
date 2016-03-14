/**
 * 控制通知用的
 * https://github.com/katzer/cordova-plugin-local-notifications
 * @param {Object} $scope
 * @param {Object} $filter 翻譯用的
 */
var controller_notification = function ($scope, $filter) {

    var _ctl = {};

    var _notification_id = 1;

    // ---------------------------------------------

    _ctl.show_notification = function (_data) {
        //alert(1212);
        if (_data === undefined) {
            _data = _ctl.get_notification_message();
        }

        if (typeof (cordova) === "object") {
            var _opt = {
                id: _notification_id,
                title: _data.title,
                text: _data.text,
                sound: "file://sound/silent.ogg",
                ongoing: true,   // 避免被關掉
                //smallIcon: "res://img/ic_stat_voc4fun_icon256/res",
                //icon: "file://img/Voc4Fun-icon256.png"
            };

            // 好吧，先假設她可以使用好了，按下去應該會打開app吧，我猜

            if (typeof (cordova.plugins) === "object"
                    && typeof (cordova.plugins.notification) === "object"
                    && typeof (cordova.plugins.notification.local) === "object"
                    && typeof (cordova.plugins.notification.local.schedule) === "function") {
                cordova.plugins.notification.local.schedule(_opt);

            }
            else {
                setTimeout(function () {
                    _ctl.show_notification(_data);
                }, 1000);
            }
        }
        else {
            var _message = _data.text;
            window.alert(_message);
        }
    };

    _ctl.hide_notification = function () {
        if (typeof (cordova) === "object"
            && typeof(cordova.plugins) !== "undefined"
            && typeof(cordova.plugins.notification) !== "undefined") {
            cordova.plugins.notification.local.cancel(_notification_id);
        }
    };

    _ctl.get_notification_message = function () {
        // @TODO 語系
        return {
            title: "全民樂單字",
            sound: "",
            text: $scope.ctl_target.get_notification_message()
        };
    };

    /**
     * 註冊
     * - 開啟時關閉通知
     * - 暫停時顯示通知
     * - 離開時顯示通知
     */
    _ctl.init = function () {
        
        if ($scope.CONFIG.control_group_version === true) {
            return;
        }
        
        var _show = function () {
            _ctl.show_notification();
        };
        var _hide = function () {
            _ctl.hide_notification();
        };

        if (typeof (cordova) === "object") {

            document.addEventListener("deviceready", _hide, false);
            document.addEventListener("pause", _show, false);
            document.addEventListener("resume", _hide, false);
        }
        
        //$.console_trace("init");
        $scope.ons_view.exit_app_add_listener(function () {
            _show();
        });
    };
    _ctl.init();

    // ----------------------------------------------

    $scope.ctl_notification = _ctl;
};