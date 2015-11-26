var controller_test_select = function ($scope) {
    
    $scope.test_select_status = {
        stack: [],
        error_stack: [],
        index: 0
    };
    
    // --------------------
    
    $scope.ctl_test_select = {};
    
    $scope.ctl_test_select.enter = function () {
        app.navi.replacePage("test_select.html");
    };
    
    $scope.ctl_test_select.init = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_test_select.next = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_test_select.prev = function (_callback) {
        $.trigger_callback(_callback);
    };
    
};