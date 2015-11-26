var controller_activity = function ($scope) {
    $scope.ctl_activity = {};
    
    $scope.ctl_activity.enter_from_target = function () {
        //$.console_trace("完成設定目標後，移動到此頁面");
        var _target_data = $scope.target_data;
        $scope.set_swipeable(true);
        
        $.console_trace("enter_from_target", _target_data);
        
        if ( (_target_data.learn_flashcard.done < _target_data.learn_flashcard.target)
                || (_target_data.test_select.done > _target_data.test_select.target)) {
            $scope.ctl_learn_flashcard.enter();
        }
        else {
            $scope.ctl_test_select.enter();
        }
        return this;
    };
    
    /**
     * 發音
     * @TODO 1126 未完成，留待舜閔研究
     * @param {String} _text
     */
    $scope.ctl_activity.speak = function (_text) {
        alert("發音：" + _text + "(未完成)");
    };
};