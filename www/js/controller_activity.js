var controller_activity = function ($scope) {
    $scope.ctl_activity = {};
    
    $scope.ctl_activity.enter_from_target = function () {
        $scope.set_swipeable(true);
        
        if ( $scope.ctl_activity.is_learn_enough() 
                && $scope.ctl_activity.is_test_enough() === false ) {
            $scope.ctl_test_select.next(false);
        }
        else {
            $scope.ctl_learn_flashcard.enter();
        }
        return this;
    };
    
    $scope.ctl_activity.is_learn_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined") {
            return false;
        }
        //$.console_trace("enter_from_target", _target_data);
        return (!(_target_data.learn_flashcard.done < _target_data.learn_flashcard.target)
                || (_target_data.test_select.done > _target_data.test_select.target));
    };
    
    $scope.ctl_activity.is_test_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined") {
            return false;
        }
        //$.console_trace("is_test_enough", _target_data);
        return !(_target_data.test_select.done < _target_data.test_select.target);
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