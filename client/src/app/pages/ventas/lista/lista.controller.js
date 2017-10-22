(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ventas')
      .controller('ventasListaController', ventasListaController);

  ventasListaController.$inject = ['$log', '$state', '$uibModal', 'serverAPI', 'Restangular', 'localStorageService'];
  function ventasListaController($log, $state, $uibModal, serverAPI, Restangular, localStorageService) {
    $log.log('ventasListaController');
    var vm = this;
    var user = localStorageService.get('user') || {};
    
    vm.ordenes = [];
    vm.busqueda = {idUser: user.id};

    vm.remove = function ($index, id) {
      
    };

    vm.buscar = function () {
      Restangular.all('ordenes').getList(vm.busqueda).then(function (resp) {
        vm.ordenes = resp || [];
      })
    };
    
    vm.buscar();
  }
})();
