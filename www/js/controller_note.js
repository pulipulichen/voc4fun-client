var controller_note = function ($scope) {
    
    var _ctl = {};
    
    var _log_file = "controller_note.js";
    
    // ------------------------------
    
    _ctl.enter = function () {
        app.navi.pushPage("note.html");
    };
    
    // -------------------------------
    
    $scope.ctl_note = _ctl;
    
};