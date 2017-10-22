(function () {
  'use strict';

  angular.module('BlurAdmin.pages.vendedores')
      .controller('vendedoresItemController', vendedoresItemController);

  vendedoresItemController.$inject = ['$log', '$stateParams', 'serverAPI', 'Restangular', 'localStorageService'];
  function vendedoresItemController($log, $stateParams, serverAPI, Restangular, localStorageService) {
    $log.log('vendedoresItemController');
    var vm = this;
    vm.user = localStorageService.get('user');
    vm.almacenes = [];
    vm.vendedor = {};

    Restangular.one('propietarios', vm.user.propietario.id).customGET('almacenes').then(function (resp) {
      vm.almacenes = (resp || {}).almacenes || [];
    });
    
    Restangular.one('vendedores', $stateParams.id).get().then(function (resp) {
      vm.vendedor = {
        id: resp.id,
        idUser: resp.id,
        idAlmacen: resp.idAlmacen,
        vCI: resp.vCI,
        vNombre: resp.vNombre || '',
        vApellidos: resp.vApellidos || '',
        vDireccion: resp.vDireccion || '',
        vTelefono: resp.vTelefono || ''
      };
    })
  }
})();
