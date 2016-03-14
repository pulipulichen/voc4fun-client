/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {
    //$.console_trace($scope.ctl_target.get_notification_message());
    //$.console_trace("_app_ready()");

    $scope.set_swipeable(false);

    $scope.ctl_flashcard.setup(function () {

        if ($scope.ctl_profile.is_exists() === false) {
            //$.console_trace("is not exists");
            $scope.ctl_profile.enter();
        }
        else {
            $scope.ctl_target.enter_from_profile(false);
        }
    });
};