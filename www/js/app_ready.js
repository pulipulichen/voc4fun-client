/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {

    ons.ready(function () {
        
        $scope.setup_menu_swipeable();
        $scope.setup_back_hotkey(document.backbutton);
        
        // ---------------------
        
        $scope.setSwipeable(false);
        $scope.flashcard_setup(function () {
            //$scope.profile_reset();
            $scope.profile_exists(function (_exists) {
                if (_exists === false) {
                    app.navi.replacePage("profile.html", {animation: 'none'});
                }
                else {
                    $scope.ctl_target.enter_from_profile(false);
                }
            });
        });
        
    });
    
};