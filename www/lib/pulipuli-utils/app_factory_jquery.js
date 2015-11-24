var _app_factory_jquery_utils = function ($scope) {
    
    /**
     * 記錄功能的縮寫
     * @author Pudding 20151123
     * @param {String} _msg
     */    
    $.log = function (_msg) {
        console.log(_msg);
    };

    $.trigger_callback = function (_callback) {
        if (typeof (_callback) === "function") {
            _callback();
        }
    };
    
    $.array_keys = function (_json) {
        var _keys = [];
        if (typeof(_json) !== "object") {
            return _keys;
        }
        for (var _field in _json) {
            _keys.push(_field);
        }
        return _keys;
    };
};