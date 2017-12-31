(function () {
  'use strict';

  angular.module('BlurAdmin.pages.upc')
      .controller('UPCListaController', UPCListaController);

  UPCListaController.$inject = ['$log', '$state', '$uibModal', '$rootScope', 'localStorageService', 'serverAPI', 'Restangular'];
  function UPCListaController($log, $state, $uibModal, $rootScope, localStorageService, serverAPI, Restangular) {
    $log.log('UPCListaController');
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

    vm.goTo = function(id) {
      $state.go('upc.item', {id: id});
    };

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/upc/borrar/borrar.template.html',
        controller: 'UPCBorrarController',
        controllerAs: 'vm',
        resolve: {
          entity: function() {
            return {title: 'UPC', name: vm.codigos[$index].nombre};
          }
        }
      });

      deleteMessage.result.then(function() {
        Restangular.one('upc', id).remove().then(function() {
          vm.codigos.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function () {
      vm.isLoading = false;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;

      Restangular.all('upc').customGET('', vm.busqueda).then(function (resp) {
        vm.codigos = (resp.data || []);

        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;
        vm.hayLista = vm.codigos.length > 0;
        vm.isLoading = true;
      });
    };
    
    vm.buscar();
  }
})();
