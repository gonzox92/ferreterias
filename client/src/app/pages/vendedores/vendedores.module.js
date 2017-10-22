(function () {
  'use strict';

  angular.module('BlurAdmin.pages.vendedores', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];
  function routeConfig($stateProvider) {
    $stateProvider
        .state('vendedores', {
          url: '/vendedores',
          template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Vendedores',
          sidebarMeta: {
            icon: 'fa fa-male',
            order: 700,
            visible: false,
            privileges: ['propietario']
          }
        })
        .state('vendedores_registrar', {
          url: '/almacenes/:id/vendedores/registrar',
          templateUrl: 'app/pages/vendedores/registrar/registrar.html',
          controller: 'vendedoresRegistroController',
          controllerAs: 'vm',
          title: 'Registrar',
          sidebarMeta: {
            order: 200,
            visible: false,
            isChild: true,
          },
        })
        .state('vendedores.listar', {
          url: '/lista',
          templateUrl: 'app/pages/vendedores/lista/lista.template.html',
          controller: 'vendedoresListaController',
          controllerAs: 'vm',
          title: 'Lista',
          sidebarMeta: {
            order: 100,
            visible: false,
            isChild: true,
          },
        })
        .state('vendedores.item', {
          url: '/:id',
          templateUrl: 'app/pages/vendedores/item/item.template.html',
          controller: 'vendedoresItemController',
          controllerAs: 'vm',
          title: 'Propietario',
          sidebarMeta: {
            order: 0,
            visible: false,
          },
        });
  }
})();
