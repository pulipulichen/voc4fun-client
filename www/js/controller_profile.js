var controller_profile = function ($scope) {
    $scope.ctl_profile = {};

    $scope.ctl_profile.submit = function () {
        // 設定log
        $scope.log("controller_profile.js", "$scope.ctl_profile.submit()", {name: $scope.profile.name});
        //$.console_trace($scope.profile.name);

        return $scope.db_profile.setup_profile(function () {
            $scope.ctl_target.enter_from_profile();
        });
    };
};