(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ventas')
    .controller('ventaRegistroController', ventaRegistroController);
  
  ventaRegistroController.$inject = ['$rootScope', '$state', 'localStorageService'];
  function ventaRegistroController($rootScope, $state, localStorageService) {
    var vm = this;
    
    vm.updateTotal = function($index) {
      var producto = $rootScope.productos[$index];

      if (producto.cantidad) {
        $rootScope.productos[$index].total = (producto.cantidad || 1) * producto.pPrecio;
      }
    };

    vm.calculateTotal = function() {
      return ($rootScope.productos || []).reduce(function(accumulator, producto) {
        return accumulator + producto.total;
      }, 0);
    };

    vm.removeProduct = function($index) {
      $rootScope.productos.splice($index, 1);
      localStorageService.set('productos', $rootScope.productos || []);
    };

    vm.continueShopping = function() {
      $state.go('buscador');
    };

    vm.checkOut = function() {
      $state.go('venta.confirmacion');
    }
  };
})();
