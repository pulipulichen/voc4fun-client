var cordova_text_to_speech = function ($scope) {

    var _ctl = {};

    // 範例：https://gist.github.com/macdonst/962784
    if (typeof (cordova) !== "undefined") {

        document.addEventListener("deviceready", function () {

//            window.plugins.tts.isLanguageAvailable("en_US", function() {
//                addLang("en_US", "English (American)");
//            }, fail);
//            
//            window.plugins.tts.isLanguageAvailable("zh_TW", function() {
//                addLang("zh_TW", "Chinese Tradition");
//            }, fail);
//            
//            window.plugins.tts.isLanguageAvailable("zh_CN", function() {
//                addLang("zh_CN", "Chinese Simpe");
//            }, fail);
//            
            _ctl.speak = function (_text) {
                window.plugins.tts.speak(_text);
            };

        }, false);
    }
    else {
        //var _tts = new GoogleTTS('zh-CN');
        
        soundManager.setup({
            url: 'lib/google-tts/',
            preferFlash: false,
            onready: function () {
                if (!window.GoogleTTS) {
                    $.console_trace("Sorry, the google-tts script couldn't be loaded.");
                    return;
                }
                
                var _googleTTS = new window.GoogleTTS();
                
                _ctl.speak = function (_text, _lang) {
                    _googleTTS.play(_text, _lang, function (err) {
                        if (err) {
                            $.console_trace(err.toString());
                        }
                        $.console_trace('Finished playing');
                    });
                };
                
                setTimeout(function () {
                    _ctl.speak("test", "en-US");
                    _ctl.speak("test2", "en_US");
                    _ctl.speak("test3", "en");
                }, 1000);
                
                // available player
                _googleTTS.getPlayer(function (err, player) {
                    if (err) {
                        return $.console_trace(err.toString());
                    }
                    if (player) {
                        $.console_trace(player.toString());
                    } else {
                        $.console_trace('None available');
                    }
                });
            }
        });
    }
    
    // --------------------------------

    $scope.cordova_text_to_speech = _ctl;

};