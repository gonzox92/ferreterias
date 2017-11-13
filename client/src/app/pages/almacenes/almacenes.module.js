(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes', ['ui.select', 'ngSanitize'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('almacenes', {
        url: '/ferreterias',
        template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        title: 'Ferreterias',
        sidebarMeta: {
          icon: 'fa fa-industry',
          order: 200,
          visible: true,
          privileges: ['administrador', 'propietario']
        }
      })
      .state('almacenes.listar', {
        url: '/lista',
        templateUrl: 'app/pages/almacenes/lista/lista.template.html',
        controller: 'almacenesListaController',
        controllerAs: 'vm',
        title: 'Lista',
        sidebarMeta: {
          order: 0,
          visible: true,
          isChild: true,
        },
      })
      .state('almacenes.registrar', {
        url: '/registrar',
        templateUrl: 'app/pages/almacenes/registrar/registrar.html',
        controller: 'almacenesRegistroController',
        controllerAs: 'vm',
        title: 'Registrar',
        sidebarMeta: {
          order: 100,
          visible: true,
          isChild: true,
        },
      })
      .state('almacenes.item', {
        url: '/:id',
        templateUrl: 'app/pages/almacenes/item/item.template.html',
        controller: 'almacenesItemController',
        controllerAs: 'vm',
        title: 'Ferreteria',
        sidebarMeta: {
          order: 200,
          visible: false
        },
      })
      .state('almacenes_item_vendedores', {
        url: '/ferreteria/:id/vendedores',
        templateUrl: 'app/pages/vendedores/lista/lista.template.html',
        controller: 'vendedoresAlmacenListaController',
        controllerAs: 'vm',
        title: 'Vendedores',
        sidebarMeta: {
          visible: false
        },
      });
  }
})();
