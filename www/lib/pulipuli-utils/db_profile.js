var db_profile = function ($scope) {
    
    var _table_name = "profile";
    
    //$scope.profile_name = "AAAA";
    
    $scope.profile = {
        name: "John Doe",
        uuid: new Fingerprint().get()
    };
    
    $scope.profile_exists = function (_callback) {
        if (typeof(_callback) !== "function") {
            return this;
        }
        
        $scope.DB.table_exists(_table_name, function (_result) {
            _callback(_result);
        });
        return this;
    };
    
    /**
     * 把$scope.user_name存進DB
     * 
     * 在名稱改變時使用，或是按下確定時使用
     */
    $scope.set_profile_to_db = function () {
        $scope.DB.insert_or_update_one(_table_name, $scope.profile);
    };
    
    $scope.setup_profile = function () {
        $scope.DB.create_table(_table_name, $.array_keys($scope.profile), function () {
            $scope.set_profile_to_db();
        });
    };
    
    $scope.profile_reset = function () {
        $scope.DB.drop_table(_table_name);
    };
};