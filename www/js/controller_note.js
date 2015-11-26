var controller_note = function ($scope) {
    
    $scope.note = {
        my: "",
        other: []
    };
    
    // ------------------------------
    
    $scope.ctl_note = {};
    
    $scope.ctl_note.enter = function () {
        $scope.ctl_note.init(function () {
            app.navi.pushPage("note.html");
        });
        
        $scope.ctl_note.load_other_note();
    };
     
    $scope.ctl_note.init = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_note.load_other_note = function (_callback) {
        $.trigger_callback(_callback);
    };
};