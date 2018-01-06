/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .run(themeRun);

  /** @ngInject */
  themeRun.$inject = ['$timeout', '$rootScope', '$location', '$state', 'layoutPaths', 'preloader', '$q', 'baSidebarService',
    'themeLayoutSettings', 'localStorageService'];
  function themeRun($timeout, $rootScope, $location, $state, layoutPaths, preloader, $q, baSidebarService,
    themeLayoutSettings, localStorageService) {
    var whatToWait = [
      preloader.loadAmCharts(),
      $timeout(3000)
    ];

    var theme = themeLayoutSettings;
    if (theme.blur) {
      if (theme.mobile) {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-mobile.jpg'));
      } else {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg.jpg'));
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-blurred.jpg'));
      }
    }

    $q.all(whatToWait).then(function () {
      $rootScope.$pageFinishedLoading = true;
    });

    $timeout(function () {
      if (!$rootScope.$pageFinishedLoading) {
        $rootScope.$pageFinishedLoading = true;
      }
    }, 100);

    // $rootScope.baseURL = 'http://localhost:8000/';
    $rootScope.baseURL = window.location.origin + '/';
    $rootScope.$baSidebarService = baSidebarService;
    $rootScope.$isLogged = !_.isEmpty(localStorageService.get('user'));
  }

})();
