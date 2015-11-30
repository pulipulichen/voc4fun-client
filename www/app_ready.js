/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {

    $scope.set_swipeable(false);

    // 如果要刪除profile，則執行這個
    //$scope.DB.drop_table(["profile", "log", "flashcard", "status", "list", "target_history"]); return this;

    $scope.ctl_flashcard.setup(function () {
        // 測試用
        //                $scope.set_swipeable(true);
        //app.navi.replacePage("note.html", {animation: 'none'}); return this;

        // 20151126
        //$scope.ctl_learn_flashcard.status.review_stack = [6, 10, 11, 6, 10, 11, 6, 10, 11, 6, 10, 11, 6, 10, 11];
        //$scope.ctl_activity.enter_from_target();return this;

        // 測試：進入單字學習頁面
        //$scope.ctl_learn_flashcard.enter();return this;
        
//        setTimeout(function () {
//
//            $scope.ctl_learn_flashcard.var.learn_flashcard.note = "121212\n121212\n121212\n121212\n121212\n121212\n121212\n121212\n";
//            $scope.$digest();
//            $scope.ctl_note.enter();
//        }, 500);
        //setTimeout(function () {
        //    app.menu.open();
        //}, 500);

        // 測試：進入設定頁面
        //app.navi.replacePage("setting.html");
        //return this;

        // debug: 進入測試頁面
        //$scope.ctl_test_select.status.stack = [1, 2, 3];
        //$scope.ctl_test_select.next(false);return this;
        
        // debug: 進入推薦頁面
        //$scope.ctl_target.init_recommend_target_data(function () {
        //    app.navi.replacePage("target_recommend.html");
        //}); return this;

        if ($scope.ctl_profile.is_exists() === false) {
            //$scope.profile = $scope.profile_mock;

            $scope.ctl_profile.enter();
            
            //app.navi.replacePage("profile.html", {animation: 'none'});
        }
        else {
            $scope.ctl_target.enter_from_profile(false);
        }
    });
};