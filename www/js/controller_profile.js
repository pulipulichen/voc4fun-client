var controller_profile = function ($scope) {

    var _ctl = {};
    
    var _log_file = "controller_profile.js";

    // --------------------------
    
    var _var = {};
    
    _var.name_mock = "John Doe";

    _ctl.var = _var;

    // --------------------------
    
    var _status = {};
    
    _status.name;
    _status.uuid;
    
    _ctl.status = _status;
    
    var _status_key = "profile";
    
    var _init_status = function () {
        return $scope.db_status.add_listener(
                _status_key,
                function (_s) {
                    _ctl.status = _s;
                    _status = _s;
                    _ctl.setup_uuid();
                },
                function () {
                    _ctl.setup_uuid();
                    return _ctl.status;
                }
        );
    };
    _init_status();
    
    // ---------------------------

//    $scope.profile_reset = function () {
//        $scope.DB.drop_table(_table_name);
//    };

//    _ctl.load_from_db = function (_callback) {
//        return $scope.db_profile.profile_exists(function (_exists) {
//            if (_exists === true) {
//                $scope.DB.get(_table_name, function (_data) {
//                    if (_data.length > 0) {
//                        $scope.profile = _data[0];
//                        //$.console_trace("load_from_db", _data[0]);
//                    }
//                    $.trigger_callback(_callback);
//                });
//            }
//            else {
//                $.trigger_callback(_callback);
//            }
//        });
//    };
    //ons.ready($scope.db_profile.load_from_db);

    /**
     * @param {function} _callback = function(_exists)
     * @returns {db_profile.$scope.db_profile}
     */
    _ctl.is_exists = function () {
//        if (typeof (_callback) !== "function") {
//            return this;
//        }
//        //$.console_trace("profile_exists");
//        return $scope.DB.row_exists(_table_name, _callback);
        return (_status.name !== undefined);
    };


//    _ctl.setup_profile = function (_callback) {
////        return $scope.DB.create_table(_table_name, $.array_keys($scope.profile), function () {
////            $scope.db_profile.save_profile_to_db(_callback);
////        });
//    };
    
    /**
     * 把$scope.user_name存進DB
     * 
     * 在名稱改變時使用，或是按下確定時使用
     */
    _ctl.save = function (_callback) {
        //$scope.$digest();
        //$.console_trace("準備儲存", $scope.profile);
//        $scope.DB.insert_or_update_one(_table_name, $scope.profile, _callback);
        $scope.db_status.save_status(_status_key);
        $.trigger_callback(_callback);
    };
    
    _ctl.setup_uuid = function () {
        if (_status.uuid === undefined || _status.uuid === 0) {
//            var _fingerprint = new Fingerprint().get();
//            _status.uuid = $.int_to_letters(_fingerprint);
            _status.uuid = $scope.db_log.get_uuid();
        }
        return _status.uuid;
    };
    
    _ctl.submit = function () {
        _ctl.setup_uuid();
        _ctl.save();
        
        // 設定log
        $scope.log(_log_file, "submit()", _status);
        
        _ctl.change_user_name(_status.name);
        
        $scope.ctl_target.enter_from_profile();
    };
    
    _ctl.change_user_name = function (_name) {
        if (_name === undefined) {
            _name = _status.name;
        }
        $scope.log(_log_file, "change_user_name()", undefined, _name);
    };
    
    _ctl.init = function (_callback) {
        if (_status.name === undefined) {
            //_status.name = $scope.cordova_utils.get_device_name();
            $scope.cordova_utils.get_device_name(function (_name) {
                _status.name = _name;
            });
        }
        $.trigger_callback(_callback);
    };
    
    _ctl.get_uuid = function () {
        return _ctl.setup_uuid();
    };
    
    _ctl.enter = function (_callback) {
        _ctl.init(function () {
            $scope.log(_log_file, "enter()", undefined, {name: _status.name});
            app.navi.replacePage("profile.html", {
                animation: 'none',
                onTransitionEnd: _callback
            });
        });
        
    };
    
    // -----------------------------------
    
    $scope.ctl_profile = _ctl;
};