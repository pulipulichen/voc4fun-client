var _app_factory_jquery_utils = function ($scope) {

    /**
     * 記錄功能的縮寫
     * @author Pudding 20151123
     * @param {String} _msg
     */
    $.console_trace = function (_msg) {
        console.trace(_msg);
    };

    $.trigger_callback = function (_callback, _parameter) {
        if (typeof (_callback) === "function") {
            _callback(_parameter);
        }
    };

    $.array_keys = function (_json) {
        var _keys = [];
        if (typeof (_json) !== "object") {
            return _keys;
        }
        for (var _field in _json) {
            _keys.push(_field);
        }
        return _keys;
    };

    /**
     * 驗證是否為陣列
     *
     * @param _obj
     * @return 驗證結果
     * @type boolean
     */
    $.is_array = function (_obj) {
        return (typeof (_obj) === 'object'
                && (_obj instanceof Array));
    };

    $.addslashes = function (_str) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: marrtins
        // +   improved by: Nate
        // +   improved by: Onno Marsman
        // +   input by: Denny Wardhana
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Oskar Larsson Högfeldt (http://oskar-lh.name/)
        // *     example 1: addslashes("kevin's birthday");
        // *     returns 1: 'kevin\'s birthday'

        _str = (_str + '').replace(/[\\"'\:]/g, '\\$&')
                .replace(/\u0000/g, '\\0');
        return _str;
    };

    /**
     * 移除反斜線
     * @param {string} _str
     * @return {string}
     */
    $.stripslashes = function (_str) {
        _str = _str.replace(/\\'/g, '\'');
        _str = _str.replace(/\\"/g, '"');
        _str = _str.replace(/\\0/g, '\0');
        _str = _str.replace(/\\\\/g, '\\');
        return _str;
    };
    
    $.escape_quotation = function (_str) {
        if (typeof(_str) !== "string") {
            return _str;
        }
        return _str.replace(/\'/g, '%27');
    };
    
    $.unescape_quotation = function (_str) {
        if (typeof(_str) !== "string") {
            return _str;
        }
        return _str.replace(/%27/g, "'");
    };
    
    $.array_shuffle = function (o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
};