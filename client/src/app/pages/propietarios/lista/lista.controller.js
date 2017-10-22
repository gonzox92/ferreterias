(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosListaController', propietariosListaController);

  propietariosListaController.$inject = ['$log', '$state', '$uibModal', 'serverAPI', 'Restangular'];
  function propietariosListaController($log, $state, $uibModal, serverAPI, Restangular) {
    $log.log('almacenesListaController');
    var vm = this;
    vm.propietarios = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;

    vm.goTo = function(id) {
      $state.go('propietarios.item', {id: id});
    }

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/propietarios/borrar/borrar.template.html',
        controller: 'propietariosBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('propietarios', id).remove().then(function() {
          vm.propietarios.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function () {
      Restangular.all('propietarios').customGET('', vm.busqueda).then(function (resp) {
        vm.propietarios = resp || [];
      });
      vm.isLoading = true;
    };

    vm.user = function (idUser) {
      $state.go('user', {id: idUser});
    };
    
    Restangular.all('propietarios').getList().then(function (resp) {
      vm.propietarios = resp || [];
      vm.isLoading = true;
    })
  }
})();
