var controller_profile = function ($scope) {
    $scope.ctl_profile = {
        submit: function () {
            // 設定log
            $scope.log("controller_profile.js", "$scope.ctl_profile.submit()", {name: $scope.profile.name});
            
            $.console_trace($scope.profile);

            $scope.db_profile.setup_profile();

            // 設定讀取xlsx
            //$scope.flashcard_setup();

            $scope.ctl_target.enter_from_profile();
        }
    };
};