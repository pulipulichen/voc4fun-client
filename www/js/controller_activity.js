var controller_activity = function ($scope) {
    $scope.ctl_activity = {};
    
    $scope.ctl_activity.enter_from_target = function () {
        //$.console_trace("完成設定目標後，移動到此頁面");
        var _target_data = $scope.target_data;
        $scope.set_swipeable(true);
        if ( (_target_data.learn_flashcard.done > _target_data.learn_flashcard.target -1)
                && (_target_data.test_select.done < _target_data.test_select.target -1)) {
            $scope.ctl_learn_flashcard.enter();
        }
        else {
            $scope.ctl_test_select.enter();
        }
        return this;
    };
};