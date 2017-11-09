(function () {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
      .controller('productosItemController', productosItemController);

  productosItemController.$inject = ['$log', '$stateParams', '$rootScope', 'serverAPI', 'Restangular'];
  function productosItemController($log, $stateParams, $rootScope, serverAPI, Restangular) {
    $log.log('productosItemController');
    var vm = this;
    vm.producto = {};
    vm.ferreterias = [];
    vm.cantidades = [];
    // vm.navigationCollapsed = false;

    vm.tabs = [{
      name: 'Detalles',
      state: 'productos_item.detail'
    }, {
      name: 'Categorias',
      state: 'productos_item.categories'
    }]
  }
})();
