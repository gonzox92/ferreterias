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

    vm.remove = function () {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/borrar/borrar.template.html',
        controller: 'productosBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('productos', vm.producto.id).remove().then(function() {
          $state.go('productos', {id: vm.producto.almacen.id});
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };
    
    serverAPI.productos.get($stateParams.idProducto).then(function (resp) {
      if (resp.pImagen !== '') {
        resp.pImagen = resp.pImagen.indexOf('http://') >= 0 || resp.pImagen.indexOf('https://') >= 0 ?
          resp.pImagen : $rootScope.baseURL + 'api/fileentry/get/' + resp.pImagen;
      }

      vm.producto = {
        id: resp.id,
        pNombre: resp.pNombre || '',
        pDescripcion: resp.pDescripcion || '',
        pImagen: resp.pImagen || '/assets/pictures/empty.png',
        pPrecio: resp.pPrecio || 0,
        pCantidadEnMano: resp.pCantidadEnMano || 0
      };
    });
  }
})();
