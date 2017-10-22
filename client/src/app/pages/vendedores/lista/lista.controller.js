(function () {
  'use strict';

  angular.module('BlurAdmin.pages.vendedores')
      .controller('vendedoresListaController', vendedoresListaController);

  vendedoresListaController.$inject = ['$log', '$state', '$stateParams', '$uibModal', 'serverAPI', 'Restangular'];
  function vendedoresListaController($log, $state, $stateParams, $uibModal, serverAPI, Restangular) {
    $log.log('vendedoresListaController');
    var vm = this;
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
      Restangular.all('vendedores').customGET('', vm.busqueda).then(function (resp) {
        vm.vendedores = resp || [];
      });
    };

    vm.user = function (idUser) {
      $state.go('user', {id: idUser});
    };

    vm.addVendedor = function() {
      $state.go('vendedores.registrar');
    };

    Restangular.one('almacenes', $stateParams.id).getList('vendedores').then(function (resp) {
      vm.vendedores = resp || [];
    })
  }
})();
