(function () {
  'use strict';

  angular.module('BlurAdmin.pages.upc', ['ui.select', 'ngSanitize'])
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('upc', {
        url: '/upc',
        template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        title: 'UPC',
        sidebarMeta: {
          icon: 'fa fa-barcode',
          order: 700,
          visible: true,
          privileges: ['administrador']
        }
      })
      .state('upc.listar', {
        url: '/lista',
        templateUrl: 'app/pages/upc/lista/lista.template.html',
        controller: 'UPCListaController',
        controllerAs: 'vm',
        title: 'Lista',
        sidebarMeta: {
          order: 0,
          visible: true,
          isChild: true,
        },
      })
      .state('upc.registrar', {
        url: '/registrar',
        templateUrl: 'app/pages/upc/registrar/registrar.template.html',
        controller: 'UPCRegistroController',
        controllerAs: 'vm',
        title: 'Registrar',
        sidebarMeta: {
          order: 100,
          visible: true,
          isChild: true
        },
      })
      .state('upc.item', {
        url: '/:id',
        templateUrl: 'app/pages/upc/item/item.template.html',
        controller: 'UPCItemController',
        controllerAs: 'vm',
        title: 'Codigo Universal de Producto (UPC)',
        sidebarMeta: {
          order: 200,
          visible: false,
        },
      });
  }
})();
