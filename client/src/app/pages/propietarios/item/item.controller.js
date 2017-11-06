(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosItemController', propietariosItemController);

  propietariosItemController.$inject = ['$log', '$state', '$stateParams', 'serverAPI', 'Restangular', 'toastr'];
  function propietariosItemController($log, $state, $stateParams, serverAPI, Restangular, toastr) {
    $log.log('propietariosItemController');
    var vm = this;
    vm.almacen = {};
    vm.propietario = {};

    vm.update = function() {
      Restangular.one('propietarios', vm.propietario.id).customPUT(vm.propietario).then(function (resp) {
        toastr.success('Propietario ha sido actualizado');
        $state.go('propietarios');
      }, function() {
        toastr.error('Informacion no pudo ser actualizada', 'Error');
      });
    };
    
    serverAPI.propietarios.get($stateParams.id).then(function (resp) {
      vm.propietario = {
        id: resp.id,
        idUser: resp.id,
        pCI: resp.pCI,
        pNombre: resp.pNombre || '',
        pApellidos: resp.pApellidos || '',
        pDireccion: resp.pDireccion || '',
        pTelefono: resp.pTelefono || ''
      };
    })
  }
})();
