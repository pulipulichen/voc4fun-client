/* global _qunit_module_setup:false */
/* global $scope:false */
/* global _ctl:false */
/* global _var:false */
/* global _status:false */
module("controller_note_list.js", QUNIT_UTILS.module_setup("ctl_note_list"));

test("init()", function (_assert) {
//    var _done = _assert.async(1);
//    var _uuid = _ctl.get_uuid();
//    notEqual(_uuid, 0, _uuid);
//    var _fingerprint = new Fingerprint().get();
//    ok((_uuid.length < (_fingerprint + "").length), _fingerprint);
//    _done();
    var _done = _assert.async(1);
    _ctl.init(function () {
        notEqual(_ctl.var.list.length, 0, JSON.stringify(_ctl.var.list)); 
        ok(_ctl.var.list.length > 1, JSON.stringify(_ctl.var.list)); 
        _done();
    });
});
