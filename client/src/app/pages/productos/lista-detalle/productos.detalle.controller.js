(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('listaProductosByCategoriesController', listaProductosByCategoriesController);

  listaProductosByCategoriesController.$inject = ['$state', '$stateParams', 'Restangular', 'localStorageService'];
  function listaProductosByCategoriesController($state, $stateParams, Restangular, localStorageService) {
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.busqueda = {nombre: '', categoria: $stateParams.idCategoria};
    vm.isLoading = true;

    vm.addProduct = function () {
      // if (vm.user.privilegio === 'vendedor') {
      //   $state.go('productos_registrar', {id: vm.user.vendedor.idAlmacen});
      // } else {
      //   $state.go('productos_registrar', {id: $stateParams.id});
      // }

      $state.go('productos_registrar', {id: $stateParams.id, idCategoria: $stateParams.idCategoria});
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
        vm.categoria = (resp || {}).categoria;
        vm.productos = ((resp || {}).productos || []).map(function(item) {
          return item;
        });

        vm.isLoading = true;
      });
    };

    vm.goTo = function(id) {
      $state.go('productos_item', {
        id: $stateParams.id,
        idCategoria: $stateParams.idCategoria,
        idProducto: id
      });
    }

    vm.goBackCategories = function() {
      $state.go('categories', {
        id: $stateParams.id
      }); 
    }

    vm.buscar();
  }
})();
