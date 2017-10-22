(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ventas')
    .controller('ventaRegistroConfirmacionController', ventaRegistroConfirmacionController);
  
  ventaRegistroConfirmacionController.$inject = ['$rootScope', '$state', 'localStorageService', 'Restangular'];
  function ventaRegistroConfirmacionController($rootScope, $state, localStorageService, Restangular) {
    var vm = this;
    var user = localStorageService.get('user') || {};

    vm.getTotal = function() {
      return ($rootScope.productos || []).reduce(function(accumulator, producto) {
        return accumulator + producto.total;
      }, 0);
    };

    vm.confirmar = function() {
      var orden = {
        idUser: user.id,
        fechaRegistro: moment().format('YYYY-MM-DD HH:mm:ss'),
        nombre: vm.nombre,
        ci: vm.ci,

        lineas: ($rootScope.productos || []).map(function(producto) {
          return {
            idOrden: 0,
            idProducto: producto.id,
            nombre: producto.pNombre,
            descripcion: producto.pDescripcion,
            precio: producto.pPrecio,
            cantidad: producto.cantidad,
            total: producto.total,
            descuento: 0
          }
        })
      }

      Restangular.all('ordenes').customPOST(orden).then(function(resp) {
        $rootScope.productos = [];
        localStorageService.set('productos', []);

        $state.go('venta.lista');
      })
    };
  };
})();
