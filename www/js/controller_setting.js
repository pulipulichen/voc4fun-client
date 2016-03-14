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
        $scope.DB.table_exists($scope.CONFIG.tables[0], function (_is_exists) {
            if (_is_exists === true) {
                // 偵測是否有Table
                $scope.DB.drop_table($scope.CONFIG.tables, function () {
                    if (typeof($scope.CONFIG.server_url) === "string") {
                        //$.console_trace($scope.CONFIG.server_url + "model/reset.php");
                        $.getJSON($scope.CONFIG.server_url + "model/reset.php", function () {
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
    };
    
    // ---------------------
    
    $scope.ctl_setting = _ctl;
};