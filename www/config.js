var app_config = function ($scope) {
    $scope.CONFIG = {
        /**
         * 伺服器的位置
         */
        "server_url": "http://www.pulipuli.tk/voc4fun/voc4fun-server/",
        
        /**
         * 選擇題考試的選項數量
         */
        "test_select_option_learn": 3,
        
        /**
         * 目標設定切換的時間
         * 
         * 單位是小時
         * 8 = 每天早上8點，8點之前算是前一天的份
         */
        "target_offset_hours": 8,
        
        /**
         * 控制組模式
         * 
         * 會關閉部分功能
         */
        "control_group_version": false,
        
        /**
         * 單元測試模式
         * 
         * 如果設為true，則強制轉移到單元測試顯示畫面
         */
        "qunit": false
    };
};