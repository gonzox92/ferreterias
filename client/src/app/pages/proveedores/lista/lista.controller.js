(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
      .controller('ProveedoresListaController', ProveedoresListaController);

  ProveedoresListaController.$inject = ['$log', '$state', '$uibModal', '$rootScope', 'localStorageService', 'serverAPI', 'Restangular'];
  function ProveedoresListaController($log, $state, $uibModal, $rootScope, localStorageService, serverAPI, Restangular) {
    $log.log('ProveedoresListaController');
    var vm = this;

    vm.user = localStorageService.get('user');
    vm.proveedores = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;
    vm.maxSize = 5;
    vm.itemsPerPage = 10;
    vm.total = 0;
    vm.page = 1;
    vm.hayProveedores = false;

    vm.goTo = function(id) {
      $state.go('proveedores.item', {id: id});
    };

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/proveedores/borrar/borrar.template.html',
        controller: 'ProveedoresBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('proveedores', id).remove().then(function() {
          vm.proveedores.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function () {
      vm.isLoading = false;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;

      Restangular.all('proveedores').customGET('', vm.busqueda).then(function (resp) {
        vm.proveedores = (resp.data || []);

        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;
        vm.hayProveedores = true;
        vm.isLoading = true;
      });
    };
    
    vm.buscar();
  }
})();
