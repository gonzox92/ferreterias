(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('almacenesListaController', almacenesListaController);

  almacenesListaController.$inject = ['$log', '$state', '$uibModal', '$rootScope', 'localStorageService', 'serverAPI', 'Restangular'];
  function almacenesListaController($log, $state, $uibModal, $rootScope, localStorageService, serverAPI, Restangular) {
    $log.log('almacenesListaController');
    var vm = this;
    vm.user = localStorageService.get('user');
    vm.almacenes = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;

    vm.productos = [];
    vm.positions = [];
    vm.busqueda = {nombre: ''};
    vm.maxSize = 5;
    vm.itemsPerPage = 10;
    vm.total = 0;
    vm.page = 1;
    vm.hayFerreterias = false;

    vm.goTo = function(id) {
      $state.go('almacenes.item', {id: id});
    };

    vm.goToProductos = function(id) {
      $state.go('categories', {id: id});
    };

    vm.goToVendedores = function(id) {
      $state.go('almacenes_item_vendedores', {id: id})
    };

    vm.remove = function($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/almacenes/borrar/borrar.template.html',
        controller: 'almacenesBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('almacenes', id).remove().then(function() {
          vm.almacenes.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function() {
      vm.isLoading = false;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;

      if (vm.user.privilegio !== 'administrador') {
        var id = (vm.user.propietario || vm.user.vendedor).id;
        Restangular.one('propietarios', id).customGET('almacenes', vm.busqueda).then(function(resp) {
          vm.almacenes = ((resp || {}).almacenes || []).map(function(almacen) {
            return almacen;
          });

          vm.hayFerreterias = true;
          vm.isLoading = true;
        });
      } else {
        Restangular.all('almacenes').customGET('', vm.busqueda).then(function(resp) {
          vm.almacenes = (resp.data || []);

          vm.total = (resp || {}).total || 0;
          vm.page = (resp || {}).current_page || 0;
          vm.hayFerreterias = true;
          vm.isLoading = true;
        })
      }
    };

    vm.buscar();
  }
})();
