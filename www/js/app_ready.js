/*global ons:false */
/*global app:false */
var _app_ready = function ($scope) {

    $scope.set_swipeable(false);

    // 如果要刪除profile，則執行這個
    //$scope.DB.drop_table(["profile", "log", "flashcard", "status", "list"]); return this;

    $scope.flashcard_setup(function () {
        // 測試用
        //                $scope.set_swipeable(true);
        //app.navi.replacePage("note.html", {animation: 'none'}); return this;

        // 20151126
        //$scope.ctl_learn_flashcard.status.review_stack = [6, 10, 11, 6, 10, 11, 6, 10, 11, 6, 10, 11, 6, 10, 11];
        //$scope.ctl_activity.enter_from_target();return this;

        $scope.ctl_learn_flashcard.enter();
        setTimeout(function () {

            $scope.ctl_learn_flashcard.var.learn_flashcard.note = "121212\n121212\n121212\n121212\n121212\n121212\n121212\n121212\n";
            $scope.$digest();
            $scope.ctl_note.enter();
        }, 500);
        //setTimeout(function () {
        //    app.menu.open();
        //}, 500);

        //app.navi.replacePage("setting.html");
        return this;

        //$scope.ctl_test_select.status.stack = [1, 2, 3];
        //$scope.ctl_test_select.next(false);return this;


        if ($scope.db_profile.is_exists() === false) {
            //$scope.profile = $scope.profile_mock;

            $scope.db_profile.init();
            app.navi.replacePage("profile.html", {animation: 'none'});
        }
        else {
            $scope.ctl_target.enter_from_profile(false);
        }
    });
};