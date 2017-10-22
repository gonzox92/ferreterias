(function () {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
      .controller('productosListaController', productosListaController);

  productosListaController.$inject = ['$log', '$state', '$stateParams', '$uibModal', '$rootScope', 'serverAPI', 'Restangular', 'localStorageService'];
  function productosListaController($log, $state, $stateParams, $uibModal, $rootScope, serverAPI, Restangular, localStorageService) {
    $log.log('productosListaController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.productos = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;
    console.log(vm.user)
    vm.goTo = function(id) {
      $state.go('productos_item', {id: $stateParams.id, idProducto: id});
    };

    vm.addProduct = function () {
      if (vm.user.privilegio === 'vendedor') {
        $state.go('productos_registrar', {id: vm.user.vendedor.idAlmacen});
      } else {
        $state.go('productos_registrar', {id: $stateParams.id});
      }
    };

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/borrar/borrar.template.html',
        controller: 'productosBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('productos', id).remove().then(function() {
          vm.productos.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function () {
      var id = vm.user.privilegio === 'vendedor' ? vm.user.vendedor.idAlmacen : $stateParams.id;
      Restangular.one('almacenes', id).customGET('productos', vm.busqueda).then(function (resp) {
        vm.productos = ((resp || {}).productos || []).map(function(item) {
          item.pImagen = item.pImagen.indexOf('http://') >= 0 || item.pImagen.indexOf('https://') >= 0 ?
            item.pImagen : $rootScope.baseURL + 'api/fileentry/get/' + item.pImagen;
          return item;
        });

        vm.isLoading = true;
      });
    };
    
    vm.buscar();
  }
})();
