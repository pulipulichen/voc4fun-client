var controller_learn_flashcard = function ($scope) {
    
    $scope.learn_flashcard = {
        q: "English",
        a: "中文的說明",
        note: "很多學生都有公共服務的需求，為了讓青年學子在服務學習的同時，學會善用圖書館豐厚的知識資源，同時能發揮愛心幫助需要幫助的人。",
        other_note_count: 0,
        other_note: []
    };
    
    // ------------------------------
    
    $scope.ctl_learn_flashcard = {};
    
    $scope.ctl_learn_flashcard.enter = function () {
        $scope.ctl_learn_flashcard.init(function () {
            app.navi.replacePage("learn_flashcard.html");
        });
    };
     
    $scope.ctl_learn_flashcard.init = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_learn_flashcard.next = function (_callback) {
        $.trigger_callback(_callback);
    };
    
    $scope.ctl_learn_flashcard.prev = function (_callback) {
        $.trigger_callback(_callback);
    };
};