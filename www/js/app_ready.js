/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {
    ons.ready(function () {

//        $scope.set_swipeable(false);
        
        // 如果要刪除profile，則執行這個
        //$scope.profile_reset();
        
        app.navi.replacePage("menu.html", {animation: 'none'});
        
//        $scope.flashcard_setup(function () {
//            $scope.db_profile.load_from_db(function () {
//                if ($scope.profile === undefined) {
//                    $scope.profile = $scope.profile_mock;
//                    app.navi.replacePage("profile.html", {animation: 'none'});
//                }
//                else {
//                    //$scope.ctl_target.enter_from_profile(false);
//                    $scope.set_swipeable(true);
//                    app.navi.replacePage("learn_flashcard.html", {animation: 'none'});
//                }
//            });
//        });
    });
};