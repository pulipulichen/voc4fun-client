var _app_factory_jquery_utils = function ($scope) {

    /**
     * 記錄功能的縮寫
     * @author Pudding 20151123
     * @param {String} _msg
     */
    $.console_trace = function (_heading, _msg) {
        if (typeof(_msg) !== "undefined") {
            _heading = "===" + _heading + "====================================";
        }
        console.trace(_heading);
        if (typeof(_msg) !== "undefined") {
            console.trace(_msg);
        }
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
    };
    
    $.parse_opt = function (_opt, _field, _default_value) {
        if (typeof(_opt[_field]) !== "undefined") {
            return _opt[_field];
        } else if (typeof(_default_value) !== "undefined") {
            return _default_value;
        }
        return;
    };
    
    $.array_get_random_index = function (_ary) {
        return Math.floor(Math.random()*_ary.length);
    };
    
    /**
     * 從陣列中取出隨機的一個，然後把它從陣列中移除
     * 例如陣列是 [1, 2, 3, 4]
     * 隨機取出3
     * 陣列被修改為 [1, 2, 4]
     * @param {type} _ary
     * @returns {$.array_random_splice._ary}
     */
    $.array_random_splice = function (_ary, _exclude_item) {
        // 先取的陣列中隨機的ID
        var _index = $.array_get_random_index(_ary);
        var _item = _ary[_index];
        if (_exclude_count !== undefined) {
            var _exclude_count = 0;
            while (_item === _exclude_item) {
                _exclude_count++;
                if (_exclude_count === _ary.length) {
                    // 表示陣列全部都是重複的
                    break;
                }

                _index++;
                if (_index === _ary.length) {
                    _index = 0;
                }
                _item = _ary[_index];
            }
        }
            
        
        _ary.splice(_index, 1);
        return _item;
    };
    
    $.clone_json = function (_json, _from_json) {
        for (var _j in _from_json) {
            _json[_j] = _from_json[_j];
        }
        return _json;
    }
};