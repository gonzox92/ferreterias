(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosItemController', propietariosItemController);

  propietariosItemController.$inject = ['$log', '$state', '$stateParams', '$uibModal', 'serverAPI', 'Restangular', 'toastr'];
  function propietariosItemController($log, $state, $stateParams, $uibModal, serverAPI, Restangular, toastr) {
    $log.log('propietariosItemController');
    var vm = this;
    vm.almacen = {};
    vm.propietario = {};

    vm.update = function() {
      Restangular.one('propietarios', vm.propietario.id).customPUT(vm.propietario).then(function (resp) {
        toastr.success('Propietario ha sido actualizado');
        $state.go('propietarios.listar');
      }, function() {
        toastr.error('Informacion no pudo ser actualizada', 'Error');
      });
    };

    vm.remove = function ($) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/propietarios/borrar/borrar.template.html',
        controller: 'propietariosBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('propietarios', vm.propietario.id).remove().then(function() {
          Restangular.one('usuarios', vm.propietario.idUser).remove().then(function() {
            $state.go('propietarios.listar');
          }, function() {
            toastr.error('Error al eliminar usuario del propietario', 'Error');
          });
        }, function() {
          toastr.error('Error al eliminar propietario', 'Error');
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };
    
    serverAPI.propietarios.get($stateParams.id).then(function (resp) {
      vm.propietario = {
        id: resp.id,
        idUser: resp.idUser,
        pCI: resp.pCI,
        pNombre: resp.pNombre || '',
        pApellidos: resp.pApellidos || '',
        pDireccion: resp.pDireccion || '',
        pTelefono: resp.pTelefono || ''
      };

      console.log(vm.propietario)
    })
  }
})();
