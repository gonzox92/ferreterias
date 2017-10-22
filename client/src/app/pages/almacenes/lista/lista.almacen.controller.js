(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('vendedoresAlmacenListaController', vendedoresAlmacenListaController);

  vendedoresAlmacenListaController.$inject = ['$log', '$state', '$stateParams', '$uibModal', 'serverAPI', 'Restangular', 'localStorageService'];
  function vendedoresAlmacenListaController($log, $state, $stateParams, $uibModal, serverAPI, Restangular, localStorageService) {
    $log.log('vendedoresAlmacenListaController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.vendedores = [];
    vm.busqueda = {nombre: ''};

    vm.goTo = function(id) {
      $state.go('vendedores.item', {id: id});
    }

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/vendedores/borrar/borrar.template.html',
        controller: 'vendedoresBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('vendedores', id).remove().then(function() {
          vm.vendedores.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function () {
      var id = vm.user.privilegio === 'vendedor' ? vm.user.vendedor.idAlmacen : $stateParams.id;
      Restangular.one('almacenes', id).getList('vendedores').then(function (resp) {
        vm.vendedores = resp || [];
      });
    };

    vm.user = function (idUser) {
      $state.go('user', {id: idUser});
    };

    vm.addVendedor = function() {
      $state.go('vendedores_registrar', {id: $stateParams.id});
    };

    vm.buscar();
  }
})();
