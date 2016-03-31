var controller_activity = function ($scope) {
    
    var _ctl = {};
    
    var _log_file = "controller_activity.js";
    
    // --------------------------
    
    _ctl.enter_from_target = function () {
        //$.console_trace("設定swipeable");
        $scope.set_swipeable(true);
        
        if ( _ctl.is_learn_enough() 
                && _ctl.is_test_enough() === false ) {
            $scope.ctl_test_select.enter(false);
        }
        else {
            $scope.ctl_learn_flashcard.enter();
        }
        return this;
    };
    
    _ctl.is_learn_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined" || typeof(_target_data.learn_flashcard) === "undefined") {
            return false;
        }
        //$.console_trace("enter_from_target", _target_data);
        return (!(_target_data.learn_flashcard.done < _target_data.learn_flashcard.target)
                || (_target_data.test_select.done > _target_data.test_select.target));
    };
    
    _ctl.is_test_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined" || typeof(_target_data.test_select) === "undefined") {
            return false;
        }
        //$.console_trace("is_test_enough", _target_data);
        return !(_target_data.test_select.done < _target_data.test_select.target);
    };
    
    /**
     * 發音
     * @param {String} _text
     */
    _ctl.speak = function (_text, _lang) {
        if ($scope.CONFIG.enable_speak === false) {
            return this;
        }
        
        //alert("發音：" + _text + "(未完成)");
        $scope.log(_log_file, "speck()", _lang, {
            "text": _text,
            "lang": _lang
        });
        
        $scope.cordova_text_to_speech.speak(_text, _lang);
    };
	
    var _window_name = "_blank";
    if (typeof(cordova) === "object") {
        _window_name = "_system";
    }
        
	/**
	 * 字典搜尋
         * @param {String} _text
	 * https://tw.dictionary.yahoo.com/dictionary?p=diction
	 */
	_ctl.query_dictionary = function ( _text, _dictionary ){
            var _search_url;
            if ( _dictionary === "yahoo"){
                _search_url = 'https://tw.dictionary.yahoo.com/dictionary?p=' + _text
            }
            else if(  _dictionary === "synonym"){
                _search_url = 'http://dictionary.sina.com.tw/word/ec/'+ _text;
            }
            else if( _dictionary === "radicals"){
                _search_url = 'http://www.english4formosa.com/drupal/?q=ety-search&keys_op=optional&keys='+ _text +'&field_tag_tid=All';
            }
            window.open( _search_url, _window_name);
            
            //紀錄LOG	
            $scope.log(_log_file, "query_dictionary()", _dictionary, _text);
	};		

	/**
	* 圖片搜尋
	*
	*/
	 _ctl.search_image = function ( _text ){
		var _search_url = 'https://www.google.com.tw/search?q='+ _text +'&espv=2&tbm=isch&tbo=u&source=univ&sa=X';
		window.open( _search_url, _window_name);

		//紀錄LOG	
		$scope.log(_log_file, "search_image()", undefined, _text);	
	 };	
	 
	 
	 
    // ---------------------
    
    $scope.ctl_activity = _ctl;
};