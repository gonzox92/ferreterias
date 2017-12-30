(function () {
  'use strict';

  angular.module('BlurAdmin.pages.login', [])
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/pages/login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        title: 'Login'
      })
      .state('login_wizard', {
        url: '/wizard',
        templateUrl: 'app/pages/login/wizard/login.wizard.template.html',
        controller: 'LoginWizardController',
        controllerAs: 'vm',
        title: 'Cuenta'
      });
  }
})();
