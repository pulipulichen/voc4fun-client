$(function () {
    $("#index_heading").click(function () {
        $.post(
            '/server/info.php', {
                'data': 'my data'
            },
            function (_data) {
                console.log(_data);
            }
        );
    });

});

var _getUserName = function () {
	return $("#username").val();
};

$(function () {
    $(".add-note").click(function () {
        //Todo : Post  文字內容、章節編號
        var _btn = $(this);

        var chapt_id = _btn.parents("[data-dojo-type='dojox/mobile/View']:first").attr("id");
        //var _user_id = "$_SESSION['userState']";
        var noteContent = $("#annotation_text").val();


        //試加的頭
        /*		$.post(  //post 把資料丟到php去存起來
			'/server/savenote.php',
			{ 'data2': chapt_id }, //打包成名為data(可自訂名稱)東西 丟給php
			function (_data2) {  // _data 可自訂名稱  用來接收被php丟回來的東西
				
			}
		);
	//試加的尾	
		
		console.log([chapt_id, noteContent]);
		//var _annotation;*/
    });

    //-----save text---
    $("#addnote_back").click(function () {

        var _btn = $(this);
        var chapt_id_back = _btn.parents("[data-dojo-type='dojox/mobile/View']:first").attr("id");
        console.log(chapt_id_back);
        var text_area = $("#annotation_text").val();
        console.log(text_area + "-test msg1");
        var userid = $("#username").val(); //
        console.log(userid); //

        $.post( //post 把資料丟到php去存起來
            '/server/savenote.php', {
                'data': text_area,
                'chaptID': chapt_id_back,
                'userID': userid //
            }, //打包成名為data(可自訂名稱)東西 丟給php
            function (_data) { // _data 可自訂名稱  用來接收被php丟回來的東西
                console.log(_data + "-test msg2 ");
            }
        );
    });


  
    //-----login---

    function login() {
        var account = $("#username").val();
        var password = $("#userpassword").val();
        console.log(account);
        $.post(
            '/server/login.php', {
                'userid': account,
                'password': password
            },
            function (result) {
                //console.log(_userid);
                if (result == '1') {
                    console.log('Success');
                    this.transitionTo("home page");
                } else {
                    console.log('Failed');
                }
            }
        );



    }

    //-----set goal---	
    $("#new_goal_btn").click(function () {
        var userid = $("#username").val();
        var goal_word_text = $("#goal_word_text").val();
        var goal_note_text = $("#goal_note_text").val();
        var goal_test_text = $("#goal_test_text").val();
        console.log(goal_word_text);
        $.post(
            '/server/setgoal.php', {

                'userID': userid,
                'goal_word': goal_word_text,
                'goal_note': goal_note_text,
                'goal_test': goal_test_text
            },
            function (_userid) {
                console.log(_userid);
            }
        );
    });

  //-----user_course---	
  
  $(function () {
    $("#index_setgoal").click(function () {
        var userid = $("#username").val();
        
        $.post(
            '/server/user_course.php', {
				'userid': userid,
                'area': 'setgoal'
            }
        );
    });

});

  
  $(function () {
    $("#index_learnlist").click(function () {
        var userid = $("#username").val();
        
        $.post(
            '/server/user_course.php', {
				'userid': userid,
                'area': 'learnlist'
            }
        );
    });

});
  


});
/*
//text area send data
$(function () {
	$("#addnote_back").click(function () {
		var text_area = $("#annotation_text").val();
		console.log( text_area + "-test msg1" );
		
		$.post(  //post 把資料丟到php去存起來
			'/server/savenote.php',
			{ 'data': text_area }, //打包成名為data(可自訂名稱)東西 丟給php
			function (_data) {  // _data 可自訂名稱  用來接收被php丟回來的東西
				console.log(_data + "-test msg2 " );
			}
		);
	});
	
});
*/


$(function () {
    $(".wrong-ans").click(function () {

        console.log("Not this!");
        //var _annotation;
    });
});


$(function () {
    $(".right-ans").click(function () {

        console.log("Good job! You're right!");
        //var _annotation;
    });
});


$(function () {
    $("#new_username_btn").click(function () {
        var account = $("#new_username_text").val();
        var password = $("#new_userpassword_text").val();
        console.log(account);
        $.post(
            '/server/info3.php', {
                'userid': account,
                'password': password
            },
            function (_userid) {
                console.log(_userid);
            }
        );
    });

});

//登入時比對
$(function () {
    //$("#btnLogin").click(login);

});

// ------------------------------------------------------------------------------

/**
 * 小試身手的所有邏輯程式
 */
$(function () {
    var _init = function () {

        if ($(".select-test").length === 0) {
            setTimeout(function () {
                _init();
            }, 500);
            console.log($(".select-test").length);
        } else {
            console.log($(".select-test").length);
            $(".select-test").click(function () {
                var _id = $(this).attr("test_id");

                var _filename = "words/word_" + _id + ".js";
                //console.log(_filename);
                $.getJSON(_filename, function (_result) {
                    var _template = $("#test_template_odd");

                    _template.find(".question_chinese").html(_result.word_chinese);
                    _template.find(".question_english").attr("question_english", _result.word_english);

                    var _options = shuffle(_result.test_options);

                    for (var _i in _options) {
                        _template.find(".option-" + _i).html(_options[_i]);
                    }

                    var _next_test_id = parseInt(_id) + 1;
                    _template.find(".next-test").attr("test_id", _next_test_id);
                });
            });

            // -----------------------------------------------------------------------

            $(".select-test").click(function () {
                var _id = $(this).attr("test_id");

                var _filename = "words/word_" + _id + ".js";
                //console.log(_filename);
                $.getJSON(_filename, function (_result) {
                    var _template = $("#test_template_odd");

                    _template.find(".question_chinese").html(_result.word_chinese);
                    _template.find(".question_english").attr("question_english", _result.word_english);

                    var _options = shuffle(_result.options);

                    for (var _i in _options) {
                        _template.find(".option-" + _i).html(_options[_i]);
                    }

                    var _next_test_id = parseInt(_id) + 1;
                    _template.find(".next-test").attr("test_id", _next_test_id);

                    _template.find(".next-test").show();
                });
            });

            // -----------------------------------------------------------------------

            $(".test_template .next-test").click(function () {
                var _id = $(this).attr("test_id");
                var _template_selector = "#test_template_even";
                if ($(this).hasClass("odd")) {
                    _template_selector = "#test_template_odd";
                }

                var _filename = "words/word_" + _id + ".js";
                $.getJSON(_filename, function (_result) {
                    var _template = $(_template_selector);

                    _template.find(".question_chinese").html(_result.word_chinese);
                    _template.find(".question_english").attr("question_english", _result.word_english);

                    var _options = shuffle(_result.test_options);

                    for (var _i in _options) {
                        _template.find(".option-" + _i).html(_options[_i]);
                    }

                    _id = parseInt(_id);
                    if (_id % 20 !== 0) {
                        var _next_test_id = _id + 1;
                        _template.find(".next-test").attr("test_id", _next_test_id);
                        _template.find(".next-test").show();
                    } else {
                        _template.find(".next-test").hide();
                    }
                });
            });

            // -----------------------------------------------------------------------

            $(".test_template .option").click(function () {
                var _option = this.innerHTML;
                var _correct_answer = $(this).parents(".test_template").find(".question_english").attr("question_english");

                if (_option === _correct_answer) {
                    alert("答對");
                } else {
                    alert("答錯");
                }
            });
        }
    };

    _init();

});

function shuffle(array) {
    if (array && array.length) {
        console.log(array);
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

// ------------------------------------------------------------------------------

/**
 * 學習單字的所有邏輯程式
 */

function AssignWords(_result) {
    var _template = $("#word_template");
    _template.find(".word_chinese").html(_result.word_chinese);
    _template.find(".word_english").html(_result.word_english);
    _template.find(".word_english").attr("word_english", _result.word_english);
}

function SetupPageButtons(currentId) {
    currentId = parseInt(currentId);
    var _template = $("#word_template");
    var _next_word_id = currentId + 1;
    var _prev_word_id = currentId - 1;
    var nextWord = _template.find(".next-word");
    var prevWord = _template.find(".back-word");
    nextWord.attr("word_id", _next_word_id);
    prevWord.attr("word_id", _prev_word_id);
    _template.find(".current-word").attr("word_id", currentId);

    if (currentId % 20 !== 0) {
        nextWord.show();
    } else {
        nextWord.hide();
    }
    if(currentId % 20 == 1)
    {
        prevWord.hide();
    }else {
         prevWord.show();
    }
    
}

var _setupWordTemplateNote = function (_currrentId) {
	var _template = $("#word_template");
	var _textarea = _template.find("textarea");
	_textarea.val("");
	
	// _currrentId
	var _userName = _getUserName();
	
	var _url = "/server/get_note.php";
	var _data = {
		user_id: _userName,
		word_id: _currrentId
	};
	
	$.post(_url, _data, function(_result) {
		_textarea.val(_result);
	});
};

$(function () {
	$("#word_template .word-note").blur(function () {
		// set_note
		var _note = this.value;
		_note = $.trim(_note);
		if (_note === "") {
			return;
		}
		
		var _data = {
			user_id: _getUserName(),
			word_id: $(this).parents("#word_template:first").find(".current-word").attr("word_id"),
			note: _note
		};
		
		console.log(_data);
		
		var _url = "/server/set_note.php";
		$.post(_url, _data, function () {});
	});
});


function SetupSelectedWords() {
                var _id = $(this).attr("word_id");
                var _template_selector = "#word_template";
                /*
                var _template_selector = "#word_template";
                if ($(this).hasClass("odd")) {
                    _template_selector = "#word_template_odd";
                }
*/
                var _filename = "words/word_" + _id + ".js";
                $.getJSON(_filename, function (_result) {
                    AssignWords(_result);
                    SetupPageButtons(_id);
					_setupWordTemplateNote(_id);


                });
            }
$(function () {
    var _init = function () {

        if ($(".select-word").length === 0) {
            setTimeout(function () {
                _init();
            }, 500);
            console.log($(".select-word").length);
        } else {
            console.log($(".select-word").length);
            $(".select-word").click(function () {
                var _id = $(this).attr("word_id");

                var _filename = "words/word_" + _id + ".js";
                //console.log(_filename);
                $.getJSON(_filename, function (_result) {
                    AssignWords(_result);


                    SetupPageButtons(_id);
					_setupWordTemplateNote(_id);
                });
            });

            // -----------------------------------------------------------------------

            $(".select-word").click(function () {

                var _id = $(this).attr("word_id");

                var _filename = "words/word_" + _id + ".js";
                //console.log(_filename);
                $.getJSON(_filename, function (_result) {
                    AssignWords(_result);

                    var _options = shuffle(_result.options);

                    for (var _i in _options) {
                        _template.find(".option-" + _i).html(_options[_i]);
                    }

                    SetupPageButtons(_id);
					_setupWordTemplateNote(_id);
                });
            });

            // -----------------------------------------------------------------------
            $(".word_template .next-word").click(SetupSelectedWords);
            $(".word_template .back-word").click(SetupSelectedWords);
        }
    };

    _init();

});





// -----------------------------------------------------------------------

/*
function login() {
		var account = $("#username").val();
		var password = $("#userpassword").val();
		console.log( account );
		$.post(
			'/server/login.php',
			{ 'userid': account ,
			  'password':password}, 
			function (result) {
				//console.log(_userid);
				if(result=='1')
				{
					console.log('Success');
					this.transitionTo("home page");
				}
				else{
					console.log('Failed');
				}
			}
		);
	}
*/

/*
//get data input text area 
$(function () {
	$("#addnote_ch1_01").click(function () {
		var text_area = $("#annotation_text").val();
		console.log( text_area + "-test msg1" );
		
		$.post(
			'/server/info2.php',
			{ 'data': text_area }, 
			function (_data) {
				$( "#annotation_text").show();
			}
		);
	});
	
});
*/