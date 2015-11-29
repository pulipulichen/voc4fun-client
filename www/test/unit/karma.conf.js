module.exports = function(config) {
  config.set({
    files : [
      /**
       * 與測試本體無關的 module
       */
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      /**
       * 要測的 module
       */
      'lib/a.js',
      'app/main.js',
      'app/services.js',
      'app/controllers.js',

      /**
       * 測試用的 spec 擺這邊
       */
      'test/helper.js',
      'test/unit/*.js'
    ],
    basePath: '../',
    frameworks: ['jasmine'],  // 測試 framework，其它也可以用 mocha, chai, sinon 做組合
    reporters: ['progress'],
    browsers: ['Chrome', 'PhantomJS'],  // 可以自行修改想要哪些瀏覽器跑過，需要安裝 launcher package
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};