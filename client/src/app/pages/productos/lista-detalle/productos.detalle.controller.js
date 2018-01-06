(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('listaProductosByCategoriesController', listaProductosByCategoriesController);

  listaProductosByCategoriesController.$inject = ['$state', '$stateParams', '$uibModal', 'Restangular', 'localStorageService'];
  function listaProductosByCategoriesController($state, $stateParams, $uibModal, Restangular, localStorageService) {
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.busqueda = {nombre: '', categoria: $stateParams.idCategoria};
    vm.isLoading = true;

    vm.addProduct = function () {
      $state.go('productos_registrar', {id: $stateParams.id, idCategoria: $stateParams.idCategoria});
    };

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/borrar/borrar.template.html',
        controller: 'productosBorrarController',
        controllerAs: 'vm',
        resolve: {
          entity: function() {
            return {
              title: 'Producto',
              name: vm.productos[$index].pNombre
            }
          }
        }
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
      vm.isLoading = true;
      var id = vm.user.privilegio === 'vendedor' ? vm.user.vendedor.idAlmacen : $stateParams.id;
      Restangular.one('almacenes', id).customGET('showProductos', vm.busqueda).then(function (resp) {
        vm.categoria = (resp || {}).categoria;
        vm.productos = ((resp || {}).productos || []).map(function(item) {
          return item;
        });

        vm.isLoading = false;
      }, function() {
        vm.isLoading = false;
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
