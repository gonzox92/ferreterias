(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ventas', ['ui.select', 'ngSanitize'])
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];
  function routeConfig($stateProvider) {
    $stateProvider
      .state('venta', {
        url: '/venta',
        title: 'Ventas',
        abstract: true,
        template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        sidebarMeta: {
          icon: 'fa fa-shopping-cart',
          order: 1000,
          visible: false,
          privileges: ['administrador', 'propietario', 'vendedor']
        }
      })
      .state('venta.lista', {
        url: '/lista',
        templateUrl: 'app/pages/ventas/lista/lista.template.html',
        controller: 'ventasListaController',
        controllerAs: 'vm',
        title: 'Lista de Ventas',
        sidebarMeta: {
          order: 0,
          visible: true,
          isChild: true
        },
      })
      .state('venta.registro', {
        url: '/registro',
        templateUrl: 'app/pages/ventas/registro/registro.template.html',
        controller: 'ventaRegistroController',
        controllerAs: 'vm',
        title: 'Orden de Venta',
        sidebarMeta: {
          order: 0,
          visible: true,
          isChild: true
        },
      })
      .state('venta.confirmacion', {
        url: '/confirmacion',
        templateUrl: 'app/pages/ventas/registro/registro.confirmar.template.html',
        controller: 'ventaRegistroConfirmacionController',
        controllerAs: 'vm',
        title: 'Confirmacion de Venta',
        sidebarMeta: {
          order: 0,
          visible: false,
          isChild: true
        },
      });
  }
})();
