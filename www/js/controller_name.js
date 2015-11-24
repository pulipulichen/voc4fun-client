var controller_name = function ($scope) {
    $scope.name_submit = function () {
        // 設定log
        $scope.log("controller_name.js", "$.scope.name_submit()", {name: $scope.profile.name});
        
        $scope.setup_profile();
        
        // 設定讀取xlsx
        $scope.flashcard_setup();
        
        //$scope.move_to_target_page();
    };
};