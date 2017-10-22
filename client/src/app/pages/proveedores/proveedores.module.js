(function () {
  'use strict';

  angular.module('BlurAdmin.pages.proveedores', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('proveedores', {
        url: '/proveedores',
        template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        title: 'Proveedores',
        sidebarMeta: {
          icon: 'fa fa-building',
          order: 250,
          visible: true,
          privileges: ['administrador']
        }
      })
      .state('proveedores.listar', {
        url: '/lista',
        templateUrl: 'app/pages/proveedores/lista/lista.template.html',
        controller: 'ProveedoresListaController',
        controllerAs: 'vm',
        title: 'Lista',
        sidebarMeta: {
          order: 0,
          visible: true,
          isChild: true,
        },
      })
      .state('proveedores.registrar', {
        url: '/registrar',
        templateUrl: 'app/pages/proveedores/registrar/registrar.html',
        controller: 'ProveedoresRegistroController',
        controllerAs: 'vm',
        title: 'Registrar',
        sidebarMeta: {
          order: 100,
          visible: true,
          isChild: true,
        },
      })
      .state('proveedores.item', {
        url: '/:id',
        templateUrl: 'app/pages/proveedores/item/item.template.html',
        controller: 'ProveedoresItemController',
        controllerAs: 'vm',
        title: 'Proveedor',
        sidebarMeta: {
          order: 200,
          visible: false,
        },
      });
  }
})();
