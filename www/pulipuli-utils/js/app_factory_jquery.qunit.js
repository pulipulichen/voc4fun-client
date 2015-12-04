/* global _qunit_module_setup:false */
/* global $scope:false */
/* global _ctl:false */
/* global _var:false */
/* global _status:false */
module("app_factory_jquery.js", QUNIT_UTILS.module_setup("app_factory_jquery"));

test("int_to_letters()", function (_assert) {
    //var _done = _assert.async(1);
    var _str;
    _str = $.int_to_letters(1);
    equal(_str, "1", _str);
    _str = $.int_to_letters(12);
    equal(_str, "c", _str);
    _str = $.int_to_letters(32);
    equal(_str, "w", _str);
    _str = $.int_to_letters(60);
    equal(_str, "Y", _str);
    _str = $.int_to_letters(72);
    equal(_str, "10", _str);
    //3466686842
    _str = $.int_to_letters(3466686842);
    equal(_str, "1U)_cq", _str);
    //_done();
});

//test("array_slice_element()", function (_assert) {
//    var _done = _assert.async(1);
//    
//    var _ary 
//});