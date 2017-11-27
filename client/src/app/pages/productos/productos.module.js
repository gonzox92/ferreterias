(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos', ['ui.select', 'ngSanitize'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('categories', {
        url: '/ferreteria/:id/categorias',
        templateUrl: 'app/pages/productos/lista/lista.template.html',
        controller: 'productosListaController',
        controllerAs: 'vm',
        title: 'Lista de Categorias',
        sidebarMeta: {
          icon: 'ion-hammer',
          order: 200,
          visible: false,
          privileges: ['vendedor']
        }
      })
      .state('categories_productos', {
        url: '/ferreteria/:id/categorias/:idCategoria/productos',
        templateUrl: 'app/pages/productos/lista-detalle/productos.detalle.template.html',
        controller: 'listaProductosByCategoriesController',
        controllerAs: 'vm',
        title: 'Lista de Productos'
      })
      .state('productos_registrar', {
        url: '/ferreteria/:id/categorias/:idCategoria/productos/registrar',
        templateUrl: 'app/pages/productos/registrar/registrar.html',
        controller: 'productosRegistroController',
        controllerAs: 'vm',
        title: 'Registrar Producto'
      })
      .state('productos_item', {
        url: '/ferreteria/:id/categorias/:idCategoria/productos/:idProducto',
        templateUrl: 'app/pages/productos/item/item.template.html',
        controller: 'productosItemController',
        controllerAs: 'vm',
        title: 'Producto'
      })
      // .state('productos_item.detail', {
      //   url: '/ferreteria/:id/productos/:idProducto/detalle',
      //   templateUrl: 'app/pages/productos/item/details/details.template.html',
      //   controller: 'productosItemDetailController',
      //   controllerAs: 'vm'
      // })
      // .state('productos_item.categories', {
      //   url: '/ferreteria/:id/productos/:idProducto/categories',
      //   templateUrl: 'app/pages/productos/item/categories/categories.template.html',
      //   controller: 'productosItemCategoriesController',
      //   controllerAs: 'vm'
      // });

    // $urlRouterProvider.when('/almacen/:id/productos/:idProducto', '/almacen/:id/productos/:idProducto/detalle');
  }
})();
