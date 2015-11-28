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
        // <script src='https://code.responsivevoice.org/responsivevoice.js'></script>
        // 支持語言：http://responsivevoice.org/text-to-speech-languages/
        
        
        var _filter_lang = function (_lang) {
            if (_lang === "en") {
                _lang = $.array_get_random([
                    "UK English Female",
                    "UK English Male",
                    "US English Female"
                ]);
            }
            else if (_lang === "en-US" || _lang === "en_US") {
                _lang = "US English Female";
            }
            else if (_lang === "en-UK" || _lang === "en_UK") {
                _lang = $.array_get_random([
                    "UK English Female",
                    "UK English Male"
                ]);
            }
            else if ($.inArray(_lang, ["zh", "zh_CN", "zh-CN", "zh_TW", "zh-TW"]) > -1) {
                _lang = "Chinese Female";
            }
            return _lang;
        };
        
        _ctl.speak = function (_text, _lang) {
            if (_lang === undefined) {
                _lang = "UK English Male";
            }
            else {
                _lang = _filter_lang(_lang);
            }
            // <input onclick='responsiveVoice.speak("Hello World");' type='button' value='🔊 Play' />
            if (typeof(responsiveVoice) === "object" 
                    && responsiveVoice.isPlaying() === false) {
                responsiveVoice.speak(_text, _lang);
                $.console_trace("Speak: " + _text + " (" + _lang + ")");
            }
            else {
                setTimeout(function () {
                    _ctl.speak(_text, _lang);
                }, 1000);
            }
        };

    }   //else {
    
    // --------------------------------

    $scope.cordova_text_to_speech = _ctl;

};