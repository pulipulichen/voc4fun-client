/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {
    //$.console_trace($scope.ctl_target.get_notification_message());
    //$.console_trace("_app_ready()");

    var _enter = function () {
        $scope.set_swipeable(false);

        //$.console_trace("$scope.ctl_flashcard.setup(function () {");
        $scope.ctl_flashcard.setup(function () {
            //$.console_trace("準備好了嗎？");
            if ($scope.ctl_profile.is_exists() === false) {
                //$.console_trace("is not exists");
                $scope.db_log.sync_init();
                $scope.ctl_profile.enter();
            }
            else {
                if ($scope.ctl_profile.check_version_match()) {
                    $scope.db_log.sync_init();
                    $scope.ctl_target.enter_from_profile(false);
                }
                else {
                    $scope.ctl_profile.reset_app();
                }
            }
        });
    };  //var _init = function () {
    
    var _ready = function () {
        if ($scope.CONFIG.remote_debug === true
                && typeof ($scope.CONFIG.server_url) === "string") {
            var _url = $scope.CONFIG.server_url + "model/debug_reset.php";
            $.get(_url);
        }

        //$.console_trace("before $scope.db_status.ready(function () {");
        $scope.db_status.ready(function () {
            //$.console_trace("after $scope.db_status.ready(function () {");
            if ($scope.CONFIG.qunit === false && $._GET("qunit") !== "1") {
                ons.ready(function () {
                    if (typeof (cordova) === "object") {
                        //alert("等待");
                        document.addEventListener("deviceready", function () {
                            _enter();
                        }, false);
                    }
                    else {
                        _enter();
                    }
                    //_app_ready($scope);
                });
            }
            else {
                if (typeof (QUNIT_INITED) === "undefined") {
                    $.getScript("pulipuli-utils/qunit.js");
                }
            }
        }); //var _ready = function () {

    };

    if ($scope.CONFIG.empty_database === true) {
        $scope.DB.table_exists($scope.CONFIG.tables[0], function (_is_exists) {
            if (_is_exists === true) {
                // 偵測是否有Table
                $scope.DB.drop_table($scope.CONFIG.tables, function () {
                    if (typeof ($scope.CONFIG.server_url) === "string") {
                        //$.console_trace($scope.CONFIG.server_url + "model/reset.php");
                        $.getJSON($scope.CONFIG.server_url + "model/reset.php", function () {
                            // 網頁重新整理
                            location.reload();
                        });
                    }
                    else {
                        location.reload();
                    }
                });
            }
            else {
                _ready();
            }
        });
    }
    else {
        _ready();
    }
};