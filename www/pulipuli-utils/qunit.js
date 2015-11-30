var _qunit_list = [
    'js/controller_note_list.qunit.js',
//    'pulipuli-utils/app_factory_jquery.qunit.js',
//    'js/controller_profile.qunit.js',
//    'pulipuli-utils/db_log.qunit.js',
    'js/controller_target.qunit.js',
];

// -------------------------------------------------------------

var QUNIT_UTILS = {};

// 第二部，載入Qunit
QUNIT_UTILS.load = function () {
    if (typeof (QUNIT_INITED) === "undefined") {
        QUNIT_INITED = true;
    }
    else {
        //console.log("Qunit已經讀取了");
        return;
    }

    // 第一步，清空Body
    $("body").html('<div id="qunit"></div><div id="qunit-fixture"></div>');

    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'lib/qunit/qunit-git.css'));
    $.getScript("lib/qunit/qunit-git.js", QUNIT_UTILS.ready);
    //console.trace("開始讀取");
};

QUNIT_UTILS.ready = function () {
    var injector = angular.injector(['ng', 'app']);
    var http = injector.get('$httpBackend');

    // 開始測試
    for (var _i = 0; _i < _qunit_list.length; _i++) {
        $.getScript(_qunit_list[_i]);
    }
};

var ctrl, $scope, injector, _ctl, _var, _status;
QUNIT_UTILS.module_setup = function (_ctl_name) {
    //console.log(_ctl_name);
    return {
        setup: function () {
            angular.module('app');
            injector = angular.injector(['ng', 'app']);

            $scope = injector.get('$rootScope').$new();
            ctrl = injector.get('$controller')('app_controller', {$scope: $scope});

            _ctl = undefined;
            _var = undefined;
            _status = undefined;
            if (typeof ($scope[_ctl_name]) === "object") {
                _ctl = $scope[_ctl_name];
                if (typeof ($scope[_ctl_name].var) !== "undefined") {
                    _var = $scope[_ctl_name].var;
                }
                if (typeof ($scope[_ctl_name].status) !== "undefined") {
                    _status = $scope[_ctl_name].status;
                }
            }
        },
        teardown: function () {

        }
    };
};

QUNIT_UTILS.load();
