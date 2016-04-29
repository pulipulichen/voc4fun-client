var cordova_utils = function ($scope) {
    
    var _ctl = {};
    
    // ---------------------------------------
    
    _ctl.get_device_name = function (_callback) {
        var _default_name = $scope.CONFIG.default_name;
        
        // 加上現在timestamp 尾碼3碼
        var _milliseconds = (new Date()).getMilliseconds() + "";
        if (_milliseconds.length === 1) {
            _milliseconds = "00" + _milliseconds;
        }
        else if (_milliseconds.length === 2) {
            _milliseconds = "0" + _milliseconds;
        }
        _default_name = _default_name + _milliseconds;
        
        if (typeof(device) !== "undefined"
                && typeof(device.name) === "string") {
            $.trigger_callback(_callback, device.name);
            //return device.name;
        }
        else if (typeof(cordova) !== "undefined") {
            var _telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
            if (typeof(_telephoneNumber) === "object") {
                _telephoneNumber.get(function(_result) {
                    //console.log("result = " + result);
                    $.trigger_callback(_callback, _result);
                }, function() {
                    $.trigger_callback(_callback, _default_name);
                });
            }
            else {
                $.trigger_callback(_callback, _default_name);
            }
        }
        else {
            $.trigger_callback(_callback, _default_name);
        }
    };
    
    // ---------------------------------------
    
    $scope.cordova_utils = _ctl;
};