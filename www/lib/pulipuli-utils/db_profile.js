var db_profile = function ($scope) {

    var _table_name = "profile";

    //$scope.profile_name = "AAAA";

    $scope.profile;

    $scope.profile_mock = {
        name: "John Doe",
        uuid: 0
    };

    $scope.profile_reset = function () {
        $scope.DB.drop_table(_table_name);
    };

    $scope.db_profile = {};

    $scope.db_profile.load_from_db = function (_callback) {
        return $scope.db_profile.profile_exists(function (_exists) {
            if (_exists === true) {
                $scope.DB.get(_table_name, function (_data) {
                    if (_data.length > 0) {
                        $scope.profile = _data[0];
                        $.console_trace("load_from_db", _data[0]);
                    }
                    $.trigger_callback(_callback);
                });
            }
            else {
                $.trigger_callback(_callback);
            }
        });
    };
    //ons.ready($scope.db_profile.load_from_db);

    /**
     * @param {function} _callback = function(_exists)
     * @returns {db_profile.$scope.db_profile}
     */
    $scope.db_profile.profile_exists = function (_callback) {
        if (typeof (_callback) !== "function") {
            return this;
        }
        $.console_trace("profile_exists");
        return $scope.DB.row_exists(_table_name, _callback);
    };


    $scope.db_profile.setup_profile = function (_callback) {
        return $scope.DB.create_table(_table_name, $.array_keys($scope.profile), function () {
            $scope.db_profile.save_profile_to_db(_callback);
        });
    };
    
    /**
     * 把$scope.user_name存進DB
     * 
     * 在名稱改變時使用，或是按下確定時使用
     */
    $scope.db_profile.save_profile_to_db = function (_callback) {
        $scope.profile.uuid = new Fingerprint().get();
        //$scope.$digest();
        //$.console_trace("準備儲存", $scope.profile);
        $scope.DB.insert_or_update_one(_table_name, $scope.profile, _callback);
    };
};