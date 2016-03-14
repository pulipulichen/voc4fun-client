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
        if (typeof(_target_data) === "undefined") {
            return false;
        }
        //$.console_trace("enter_from_target", _target_data);
        return (!(_target_data.learn_flashcard.done < _target_data.learn_flashcard.target)
                || (_target_data.test_select.done > _target_data.test_select.target));
    };
    
    _ctl.is_test_enough = function () {
        var _target_data = $scope.ctl_target.status;
        if (typeof(_target_data) === "undefined") {
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
        //alert("發音：" + _text + "(未完成)");
        $scope.log(_log_file, "speck()", _lang, {
            "text": _text,
            "lang": _lang
        });
        
        $scope.cordova_text_to_speech.speak(_text, _lang);
    };
	
	/**
	 * 字典搜尋
     * @param {String} _text
	 * https://tw.dictionary.yahoo.com/dictionary?p=diction
	 */
	 _ctl.dictionary = function ( _text, _dictionary ){
		if ( _dictionary == "yahoo"){
			var _search_url = 'https://tw.dictionary.yahoo.com/dictionary?p=' + _text;

			window.open( _search_url, '_system');

		}
		else if(  _dictionary == "synonym"){
			var _search_url = 'http://www.thesaurus.com/browse/'+ _text + '?s=t';
			window.open( _search_url, '_system');			
		}
		else if( _dictionary == "radicals"){
			var _search_url = 'http://www.english4formosa.com/drupal/?q=ety-search&keys_op=optional&keys='+ _text +'&field_tag_tid=All';
			window.open( _search_url, '_system');		
		}
		//紀錄LOG	
		$scope.log(_log_file, "dictionary()", {
			"text": _text,
			"dictionary": _dictionary			
		});
	};		

	/**
	* 圖片搜尋
	*
	*/
	 _ctl.image_search = function ( _text ){

		var _search_url = 'https://www.google.com.tw/search?q='+ _text +'&espv=2&tbm=isch&tbo=u&source=univ&sa=X';
		window.open( _search_url, '_system');

		//紀錄LOG	
		$scope.log(_log_file, "image_search()", {
			"text": _text		
		});		
	 
	 };	
	 
	 
	 
    // ---------------------
    
    $scope.ctl_activity = _ctl;
};