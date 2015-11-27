var cordova_utils = function ($scope) {
    
    var _ctl = {};
    
    // ---------------------------------------
    
    _ctl.get_device_name = function () {
        if (typeof(device) !== "undefined"
                && typeof(device.name) === "string") {
            return device.name;
        }
        else {
            return "John Doe";
        }
    };
    
    // ---------------------------------------
    
    $scope.cordova_utils = _ctl;
};