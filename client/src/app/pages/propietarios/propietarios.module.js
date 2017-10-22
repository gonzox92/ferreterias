(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('propietarios', {
          url: '/propietarios',
          template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Propietarios',
          sidebarMeta: {
            icon: 'ion-android-laptop',
            order: 600,
            visible: true,
            privileges: ['administrador'],
          }
        })
        .state('propietarios.registrar', {
          url: '/registrar',
          templateUrl: 'app/pages/propietarios/registrar/registrar.html',
          controller: 'propietariosRegistroController',
          controllerAs: 'vm',
          title: 'Registrar',
          sidebarMeta: {
            order: 200,
            visible: true,
            isChild: true,
          },
        })
        .state('propietarios.listar', {
          url: '/lista',
          templateUrl: 'app/pages/propietarios/lista/lista.template.html',
          controller: 'propietariosListaController',
          controllerAs: 'vm',
          title: 'Lista',
          sidebarMeta: {
            order: 100,
            visible: true,
            isChild: true,
          },
        })
        .state('propietarios.item', {
          url: '/:id',
          templateUrl: 'app/pages/propietarios/item/item.template.html',
          controller: 'propietariosItemController',
          controllerAs: 'vm',
          title: 'Propietario',
          sidebarMeta: {
            order: 0,
            visible: false,
          },
        });
  }
})();
