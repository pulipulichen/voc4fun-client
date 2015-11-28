var controller_activity = function ($scope) {
    
    var _ctl = {};
    
    var _log_file = "controller_activity.js";
    
    // --------------------------
    
    _ctl.enter_from_target = function () {
        $scope.set_swipeable(true);
        
        if ( _ctl.is_learn_enough() 
                && _ctl.is_test_enough() === false ) {
            $scope.ctl_test_select.next(false);
        }
        else {
            $scope.ctl_learn_flashcard.enter();
        }
        return this;
    };
    
    _ctl.is_learn_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined") {
            return false;
        }
        //$.console_trace("enter_from_target", _target_data);
        return (!(_target_data.learn_flashcard.done < _target_data.learn_flashcard.target)
                || (_target_data.test_select.done > _target_data.test_select.target));
    };
    
    _ctl.is_test_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined") {
            return false;
        }
        //$.console_trace("is_test_enough", _target_data);
        return !(_target_data.test_select.done < _target_data.test_select.target);
    };
    
    /**
     * 發音
     * @param {String} _text
     */
    _ctl.speak = function (_text, _lang) {
        //alert("發音：" + _text + "(未完成)");
        $scope.log(_log_file, "speck", undefined, {
            "text": _text,
            "lang": _lang
        });
        
        $scope.cordova_text_to_speech.speak(_text, _lang);
    };
    
    // ---------------------
    
    $scope.ctl_activity = _ctl;
};