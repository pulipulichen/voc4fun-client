var _qunit_list = [
    'js/controller_target.qunit.js'
];

// -------------------------------------------------------------

// 第二部，載入Qunit
var _load_qunit = function () {
    if (typeof(QUNIT_INITED) === "undefined") {
        QUNIT_INITED = true;
    }
    else {
        //console.log("Qunit已經讀取了");
        return;
    }
    
    // 第一步，清空Body
    $("body").html('<div id="qunit"></div><div id="qunit-fixture"></div>');
    
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'lib/qunit/qunit-git.css'));
    $.getScript("lib/qunit/qunit-git.js", _qunit_ready);
    console.trace("開始讀取");
};

var _qunit_ready = function () {
    var injector = angular.injector(['ng', 'app']);
    var http = injector.get('$httpBackend');

    // 開始測試
    for (var _i = 0; _i < _qunit_list.length; _i++) {
        $.getScript(_qunit_list[_i]);
    }
};

var ctrl, $scope, injector, horizonMock;
var _qunit_module_setup = {
    setup: function () {
        angular.module('app');
        injector = angular.injector(['ng', 'app']);

        $scope = injector.get('$rootScope').$new();
        ctrl = injector.get('$controller')('app_controller', {$scope: $scope});
    },
    teardown: function () {

    }
};

_load_qunit();
