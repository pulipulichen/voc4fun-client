var _app_factory_jquery_utils = function ($scope) {

    /**
     * 記錄功能的縮寫
     * @author Pudding 20151123
     * @param {String} _msg
     */
    $.console_trace = function (_heading, _msg) {
        if (typeof (_msg) !== "undefined") {
            _heading = "===" + _heading + "====================================";
        }
        console.trace(_heading);
        if (typeof (_msg) !== "undefined") {
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
        //$.console_trace("$.array_keys", _json);
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
        if (typeof (_str) !== "string") {
            return _str;
        }
        return _str.replace(/\'/g, '%27');
    };

    $.unescape_quotation = function (_str) {
        if (typeof (_str) !== "string") {
            return _str;
        }
        return _str.replace(/%27/g, "'");
    };

    $.array_shuffle = function (o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    };

    $.parse_opt = function (_opt, _field, _default_value) {
        if (typeof (_opt[_field]) !== "undefined") {
            return _opt[_field];
        } else if (typeof (_default_value) !== "undefined") {
            return _default_value;
        }
        return;
    };

    $.array_get_random_index = function (_ary) {
        return Math.floor(Math.random() * _ary.length);
    };

    /**
     * max = 3
     * min = 0
     * math = 1
     *  
     */
    $.get_random = function (_min, _max) {
        if (_min !== 0 && _max === undefined) {
            _max = _min;
            _min = 0;
        }
        return (Math.floor(Math.random() * (_max - _min)) + min);
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


        _ary = _ary.splice(_index, 1);
        return _item;
    };

    $.array_get_random = function (_ary, _exclude_item) {
        // 先取的陣列中隨機的ID
        var _index = $.array_get_random_index(_ary);
        var _item = _ary[_index];

        if (_exclude_item !== undefined) {
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
        return _item;
    };

    $.clone_json = function (_json, _from_json) {
        for (var _j in _from_json) {
            _json[_j] = _from_json[_j];
        }
        return _json;
    };

    $.array_slice_element = function (_ele, _ary) {
        var _i = $.inArray(_ele, _ary);
        if (_i > -1) {
            _ary.splice(_i, 1);
        }
        return _ary;
    };
    
    $.array_slice_all_element = function (_ele, _ary) {
        while ($.inArray(_ele, _ary) > -1) {
            var _i = $.inArray(_ele, _ary);
            _ary.splice(_i, 1);
        }
        return _ary;
    };

    $.array_merge_if_same = function (_ary) {
        if (_ary.length > 1) {
            var _first_ele = _ary[0];
            var _all_same = true;

            for (var _i = 1; _i < _ary.length; _i++) {
                if (_first_ele !== _ary[_i]) {
                    _all_same = false;
                    break;
                }
            }

            if (_all_same === true) {
                _ary = [_first_ele];
            }
        }
        return _ary;
    };

    $.getScript = function (_src, _func) {
        var _script = document.createElement('script');
        //_script.async = "async";
        _script.src = _src;
        if (_func) {
            _script.onload = _func;
        }
        document.getElementsByTagName("head")[0].appendChild(_script);
    };

    $._GET = function (_key) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === _key) {
                return pair[1];
            }
        }
    };
    
    $.int_to_letters = function (_int) {
        var _code = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$-_.+!*'()".split("");
        //$.console_trace(_code.length);  // 72
        // 72*72 = 5184
        var _output = "";
        while (_int > _code.length - 1) {
            //var _division = Math.floor(_int / _code.length)-1;
            //$.console_trace(_division);
            
            var _mode = _int % _code.length;
            //_mode = _mode - 1;
            _output = _code[_mode] + _output;
            
            _int = (_int - _mode) / _code.length;
        }
        _output = _code[_int] + _output;
        //_output = _output + _code[_int];
        return _output;
    };
};