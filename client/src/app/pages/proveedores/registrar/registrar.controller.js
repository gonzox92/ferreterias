(function () {
  'use strict';

  angular.module('BlurAdmin.pages.proveedores')
      .controller('ProveedoresRegistroController', ProveedoresRegistroController);

  ProveedoresRegistroController.$inject = ['$log', '$state', '$scope', '$rootScope', 'localStorageService', 'Restangular', 'Upload'];
  function ProveedoresRegistroController($log, $state, $scope, $rootScope, localStorageService, Restangular, Upload) {
    $log.log('ProveedoresRegistroController');
    var vm = this;
    var user = localStorageService.get('user');
    
    vm.proveedor = {
      idUser: 0,
      pNombre: '',
      pLogo: '',
      pDescripcion: ''
    };

    vm.submit = function() {
      Restangular.all('proveedores').post(vm.proveedor).then(function(resp) {
        $state.go('proveedores.listar');
      });
    };

    vm.upload = function (files) {
      if (!vm.file.$error) {
        Upload.upload({
          url: $rootScope.baseURL + 'api/fileentry/add',
          data: {file: vm.file}
        }).then(function (resp) {
          vm.proveedor.pLogo = ((resp || {}).data || {}).filename || '';
          vm.submit();
        });
      }
    };
  }
})();
