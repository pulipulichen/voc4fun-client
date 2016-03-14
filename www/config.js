var app_config = function ($scope) {
    $scope.CONFIG = {
        /**
         * 伺服器的位置
         */
        //"server_url": "http://localhost/voc4fun/voc4fun-server/",
        "server_url": "http://exp-voc4fun-2015.dlll.nccu.edu.tw/voc4fun-server/",
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
        
        default_name: "Voc4Fun",
        
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
        ]
    };
			/*{
                "key": "test_survey",
                //"default_target": 30,
                "default_target": 1,
                "min": 0,
                "default_max": 6,
                "title": "閱讀策略選擇",
                "help_img": "img/loading.svg",
                "help": "選擇每天採用的閱讀策略方法。\n共有四種閱讀策略可以選擇。",
                "complete_message": "恭喜您完成了今日目標！"
            }*/
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
		],
    }
};