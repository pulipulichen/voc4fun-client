var app_config = function ($scope) {
    $scope.CONFIG = {
        /**
         * 伺服器的位置
         */
        //"server_url": "http://localhost/voc4fun/voc4fun-server/",
        "server_url": "http://exp-voc4fun-2015.dlll.nccu.edu.tw/voc4fun-server/",
        //"server_url": "http://pc.pulipuli.info:8080/voc4fun/voc4fun-server/",
        // http://pc.pulipuli.info:8080/voc4fun/voc4fun-client  http://goo.gl/BCV6gy
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
        "control_group_version": true,
        /**
         * 單元測試模式
         * 
         * 如果設為true，則強制轉移到單元測試顯示畫面
         */
        "qunit": false,
        /**
         * 清空資料庫的模式
         */
        //"empty_database": false,
        //"empty_database": true,
        
        /**
         * 設定時間偏移，單位是天數
         */
        day_offset: 0,
        
        /**
         * 預設的使用者名稱
         */
        default_name: "Voc4Fun",
        
        /**
         * 自動間隔同步時間，單位是分鐘
         * -1表示不設定
         */
        sync_interval: 5,
        
        /**
         * 小螢幕尺寸
         */
        small_width: 500,
        
        /**
         * 是否啟用發音功能
         */
        enable_speak: false,
        
        /**
         * 是否顯示重置按鈕
         */
        enable_reset: true,
        
        /**
         * 重置動作中包含遠端資料庫的重置
         */
        enable_database_reset: false,
        
        /**
         * 表格名稱
         * @params String[]
         */
        "tables": ["log", "flashcard", "status", "target_history"],
        "target_setting": [
            {
                "key": "learn_flashcard",
                //"default_target": 30,
                "default_target": 3,
                "min": 0,
                "default_max": 100,
                "title": "學習單字",
                "help_img": "img/loading.svg",
                "help": "設定每天目標學習的單字數量。",
                "complete_message": "恭喜您完成了今日目標！"
            },
            {
                "key": "take_note",
                //"default_target": 20,
                "default_target": 2,
                "min": 0,
                "default_max": 100,
                "title": "撰寫筆記",
                "help_img": "img/loading.svg",
                "help": "設定每天要撰寫的筆記數量。\n針對不同單字，寫下你對不同單字的筆記與想法。\n字數及內容不拘，可隨意發揮。",
                "complete_message": "恭喜您完成了今日目標！"
            },
            {
                "key": "test_select",
                //"default_target": 30,
                "default_target": 3,
                "min": 0,
                "default_max": 100,
                "title": "答對測驗",
                "help_img": "img/loading.svg",
                "help": "設定每天目標答對的題目數量。\n題目都是三選一的選擇題。",
                "complete_message": "恭喜您完成了今日目標！"
            }
        ],
        "test_survey":[
                {
                        "key": "wordcard",
                        "title": "單字卡學習法"							
                },
                {
                        "key": "image",
                        "title": "圖像學習法"
                },
                {
                        "key": "synonym",
                        "title": "同義詞學習法"
                },
                {
                        "key": "rootprefix",
                        "title": "字根字首學習法"
                }
        ]
    };
};
