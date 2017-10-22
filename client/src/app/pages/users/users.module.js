(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users', [])
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user/{id}',
        templateUrl: 'app/pages/users/item/item.template.html',
        controller: 'UserController',
        controllerAs: 'vm',
        title: 'Usuario'
      });
  }
})();
