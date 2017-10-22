(function () {
  'use strict';

  angular.module('BlurAdmin.pages.productos', ['ui.select', 'ngSanitize'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('productos', {
          url: '/almacen/:id/productos',
          templateUrl: 'app/pages/productos/lista/lista.template.html',
          controller: 'productosListaController',
          controllerAs: 'vm',
          title: 'Lista de Productos',
          sidebarMeta: {
            icon: 'ion-hammer',
            order: 200,
            visible: false,
            privileges: ['vendedor']
          }
        })
        .state('productos_almacen', {
          url: '/productos',
          templateUrl: 'app/pages/productos/lista/lista.template.html',
          controller: 'productosListaController',
          controllerAs: 'vm',
          title: 'Lista de Productos',
          sidebarMeta: {
            icon: 'ion-hammer',
            order: 200,
            visible: true,
            privileges: ['vendedor']
          }
        })
        .state('productos_registrar', {
          url: '/almacen/:id/productos/registrar',
          templateUrl: 'app/pages/productos/registrar/registrar.html',
          controller: 'productosRegistroController',
          controllerAs: 'vm',
          title: 'Registrar'
        })
        .state('productos_item', {
          url: '/almacen/:id/productos/:idProducto',
          templateUrl: 'app/pages/productos/item/item.template.html',
          controller: 'productosItemController',
          controllerAs: 'vm',
          title: 'Producto'
        });
  }
})();
