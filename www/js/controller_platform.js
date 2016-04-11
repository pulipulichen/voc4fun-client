var controller_platform = function ($scope) {
    
    var _ctl = {};
    
    // 加入平臺的記錄
    _ctl.recordPlatform = function () {
        var _version = navigator.appVersion;
        $scope.log("controller_platform.js", "recordPlatform()", undefined, _version);
        //$.console_trace(_version);
    };
    
    // 加入平臺的記錄
    _ctl.recordGroup = function () {
        $scope.log("controller_platform.js", "recordGroup()", undefined, $scope.CONFIG.control_group_version);
        //$.console_trace(_version);
    };
    
    //_ctl.recordPlatform();
    
    _ctl.adjustCrossPlatform = function () {
        var _version = navigator.appVersion;
        if (_version.indexOf("AppleWebKit/534.46 (KHTML, like Gecko ) Version/5.1") > -1) {
            $scope.CONFIG.enable_speak = false;
        }
    };
    
    _ctl.adjustCrossPlatform();
    
    $scope.ctl_platform = _ctl;
};