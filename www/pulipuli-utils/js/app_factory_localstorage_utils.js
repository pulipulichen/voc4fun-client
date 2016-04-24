var _app_factory_localstorage_utils = function ($scope) {
    
    var _ctl = {};
    
    _ctl.isTableExists = function (_table) {
        var _data = _ctl.get(_table);
        return (typeof(_data) !== "undefined");
    };
    
    _ctl.set = function (_table, _key, _value) {
        //$.console_trace("set()", _value);
        if (_table === undefined) {
            return;
        }
        //$.console_trace("set() table", _table);
        //$.console_trace("set() typeof key", typeof(_key));
        if (typeof(_key) === "string" || typeof(_key) === "number") {

            var _data = _ctl.get(_table);
            
            if ( _data === undefined || _data === null) {
                _data = {};
            }
            
            //$.console_trace("set()", _key);
            _data[_key] = _value;
            
            _data = JSON.stringify(_data);
            localStorage.setItem(_table, _data);
        }
        else if (typeof(_key) === "object") {
            _key = JSON.stringify(_key);
            localStorage.setItem(_table, _key);
        }
    };
    
    _ctl.get = function (_table, _key) {
        var _data = localStorage.getItem(_table);
        //$.console_trace(_data);
        if (_data === null) {
            return;
            _data = undefined;
        }
        _data = $.json_parse(_data);
        
        //$.console_trace(typeof(_data));
        
        if (_key === undefined) {
            return _data;
        }
        
        var _value;
        if (typeof(_data) === "object" && typeof(_data[_key]) !== "undefined") {
            _value = _data[_key];
        }
        
        
        return _value;
    };
    
    /**
     * 計算表格內資料的數量
     * @param {type} _table
     * @returns {localStorage@call;getItem.length|Number|undefined}
     */
    _ctl.countArray = function (_table) {
        var _data = localStorage.getItem(_table);
        if (_data === null) {
            return;
        }
        
        if (typeof(_data) === "object" && typeof(_data.length) === "number") {
            return _data.length;
        }
        else {
            return 1;
        }
    };
    
    $scope.ls = _ctl;
    
};