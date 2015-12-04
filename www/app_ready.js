/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {

    $scope.set_swipeable(false);

    $scope.ctl_flashcard.setup(function () {

        if ($scope.ctl_profile.is_exists() === false) {
            $scope.ctl_profile.enter();
        }
        else {
            $scope.ctl_target.enter_from_profile(false);
        }
    });
};