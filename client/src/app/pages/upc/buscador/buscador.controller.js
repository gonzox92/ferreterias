(function () {
  'use strict';

  angular.module('BlurAdmin.pages.upc')
      .controller('UPCBuscadorController', UPCBuscadorController);

  UPCBuscadorController.$inject = ['$log', '$state', '$uibModal', '$rootScope', '$uibModalInstance', 'localStorageService', 'serverAPI', 'Restangular'];
  function UPCBuscadorController($log, $state, $uibModal, $rootScope, $uibModalInstance, localStorageService, serverAPI, Restangular) {
    $log.log('UPCBuscadorController');
    var vm = this;

    vm.user = localStorageService.get('user');
    vm.codigos = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;
    vm.maxSize = 5;
    vm.itemsPerPage = 10;
    vm.total = 0;
    vm.page = 1;
    vm.hayLista = false;

    vm.buscar = function () {
      vm.isLoading = false;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;

      Restangular.all('upc').customGET('', vm.busqueda).then(function (resp) {
        vm.codigos = (resp.data || []);

        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;
        vm.lastPage = (resp || {}).last_page || 1;
        vm.hayLista = vm.codigos.length > 0;
        vm.isLoading = true;
      });
    };

    vm.selectRow = function($index) {
      vm.codigos = vm.codigos.map(function(codigo) {
        codigo.isSelected = false;
        return codigo;
      });

      vm.codigos[$index].isSelected = true;
      vm.selectedRow = _.clone(vm.codigos[$index]);
    };

    vm.choose = function() {
      $uibModalInstance.close(vm.selectedRow);
    };

    vm.close = function() {
      $uibModalInstance.dismiss('cancel');
    }
    
    vm.buscar();
  }
})();
