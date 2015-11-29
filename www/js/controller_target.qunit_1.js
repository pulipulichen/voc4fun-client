/* global _qunit_module_setup:false */
/* global $scope:false */
module("controller_target.qunit.js", _qunit_module_setup);

test("get_set_title()", function () {
    var _title = $scope.ctl_target.get_set_title();
    equal(_title.substr(0, 2), "設定");
});