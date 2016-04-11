var controller_setting = function ($scope) {
    
    var _ctl = {};
    
    var _log_file = "controller_setting.js";
    
    // --------------------------
    
    _ctl.share_app = function () {
        alert(34);
    };
    
    var _reload = function () {
        //$scope.ctl_profile.reset();
        location.reload();
        //$.console_trace($scope.ctl_profile.status);
    };
    
    _ctl.reset_app = function () {
        if (window.confirm("您確定要重置嗎？")) {
            localStorage.clear();
            $scope.DB.table_exists($scope.CONFIG.tables[0], function (_is_exists) {
                if (_is_exists === true) {
                    // 偵測是否有Table
                    $scope.DB.drop_table($scope.CONFIG.tables, function () {
                        if (typeof ($scope.CONFIG.server_url) === "string" 
                                && $scope.CONFIG.enable_database_reset === true) {
                            //$.console_trace($scope.CONFIG.server_url + "model/reset.php");
                            $.getJSON($scope.CONFIG.server_url + "model/reset.php?uuid=" + $scope.ctl_profile.status.uuid, function () {
                                // 網頁重新整理
                                _reload();
                            });
                        }
                        else {
                            _reload();
                        }
                    });
                }
                else {
                    _reload();
                }
            });
        }   //if (window.confirm("您確定要重置嗎？")) {
    };
    
    // ---------------------
    
    _ctl.log = [];
    
    _ctl.reload_log = function (_callback) {
//        var _log = {
//            "file_name": "file_name",
//            "function_name": "function_name",
//            "qualifier": "qualifier",
//            "timestamp": 121212,
//            "data": "data"
//        };
//        //_ctl.log.push(_log);
//        //_ctl.log.push(_log);
//        _ctl.log = [{
//            "file_name": "file_name",
//            "function_name": "function_name",
//            "qualifier": "qualifier",
//            "timestamp": 121212,
//            "data": "data"
//        }, {
//            "file_name": "file_name",
//            "function_name": "function_name",
//            "qualifier": "qualifier",
//            "timestamp": 121212,
//            "data": "data"
//        }];
////        _ctl.log.push(_log);
////        _ctl.log.push(_log);
////        _ctl.log.push(_log);
//        $.console_trace(_ctl.log);
        var _sql = "SELECT * FROM log ORDER BY timestamp DESC LIMIT 0, 100";
        var _sql_data = [];
        
        $scope.DB.exec(_sql, _sql_data, function (_data) {
            _ctl.log = _data;
            $.trigger_callback(_callback);
        });
    };
    
    _ctl.open_log = function () {
        _ctl.reload_log(function () {
            app.navi.pushPage('log.html');
        });
    };
    
    _ctl.toggle_debug_mode = function ($event) {
        $scope.CONFIG.enable_log = !$scope.CONFIG.enable_log;
        $scope.CONFIG.enable_reset = !$scope.CONFIG.enable_reset;
        
        app.navi.replacePage('setting.html', {animation: 'none'});
        $scope.menu_click($event);
    };
    
    // ---------------------
    
    $scope.ctl_setting = _ctl;
};