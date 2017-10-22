(function () {
  'use strict';

  angular.module('BlurAdmin.pages.buscador', ['ui.select', 'ngSanitize'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('buscador', {
        url: '/buscador',
        templateUrl: 'app/pages/buscador/buscador.template.html',
        controller: 'buscadorController',
        controllerAs: 'vm',
        title: 'Buscador',
        sidebarMeta: {
          icon: 'fa fa-search',
          order: 90,
          visible: true,
          privileges: '*',
        }
      });
  }
})();
