(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosItemController', propietariosItemController);

  propietariosItemController.$inject = ['$log', '$stateParams', 'serverAPI'];
  function propietariosItemController($log, $stateParams, serverAPI) {
    $log.log('propietariosItemController');
    var vm = this;
    vm.almacen = {};
    vm.propietario = {};
    
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
