(function () {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
      .controller('productosRegistroController', productosRegistroController);

  productosRegistroController.$inject = ['$log', '$state', '$stateParams', '$rootScope', 'serverAPI', 'Restangular', 'localStorageService', 'Upload'];
  function productosRegistroController($log, $state, $stateParams, $rootScope, serverAPI, Restangular, localStorageService, Upload) {
    $log.log('productosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};

    vm.proveedores = [];
    vm.producto = {
      idProveedor: 0,
      idAlmacen: vm.user.privilegio === 'vendedor' ? vm.user.vendedor.idAlmacen : +$stateParams.id,
      pNombre: '',
      pDescripcion: '',
      pImagen: '/assets/pictures/empty.png',
      pPrecio: 0,
      pCantidadEnMano: 0
    };

    vm.submit = function() {
      serverAPI.productos.post(vm.producto).then(function(resp) {
        if (vm.user.privilegio === 'vendedor') {
          $state.go('productos_almacen');
        } else {
          $state.go('productos', {id: $stateParams.id});
        }
      });
    };

    vm.upload = function (files) {
      if (!vm.file.$error) {
        Upload.upload({
          url: $rootScope.baseURL + 'api/fileentry/add',
          data: {file: vm.file}
        }).then(function (resp) {
          vm.producto.pImagen = ((resp || {}).data || {}).filename || '';
          vm.submit();
        });
      }
    };

    Restangular.all('proveedores').getList().then(function(resp) {
      vm.proveedores = resp || [];
    });
  }
})();
