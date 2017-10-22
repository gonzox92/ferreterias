(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
      .controller('almacenesRegistroController', almacenesRegistroController);

  almacenesRegistroController.$inject = ['$log', '$state', '$rootScope', '$scope', 'localStorageService', 'serverAPI', 'Restangular', 'Upload'];
  function almacenesRegistroController($log, $state, $rootScope, $scope, localStorageService, serverAPI, Restangular, Upload) {
    $log.log('productosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user');
    
    vm.propietarios = [];
    vm.almacen = {
      idPropietario: 0,
      aNombre: '',
      aImagen: '',
      aDireccion: '',
      aUbicacion: '',
      aHorario: '',
      aEntrega: 'recoge'
    };

    $scope.$on('mapInitialized', function(evt, evtMap) {
      vm.map = evtMap;
    });
    console.log(vm.user);

    vm.submit = function() {
      var currentPosition = vm.map.markers[0].getPosition();
      vm.almacen.aUbicacion = '[' + currentPosition.lat() + ',' + currentPosition.lng() +  ']';
      vm.almacen.idPropietario = vm.user.privilegio !== 'administrador' ? 
        vm.user.propietario.id : vm.almacen.idPropietario;

      serverAPI.almacenes.post(vm.almacen).then(function(resp) {
        $state.go('almacenes.listar');
      });
    };

    vm.upload = function (files) {
      if (!vm.file.$error) {
        Upload.upload({
          url: $rootScope.baseURL + 'api/fileentry/add',
          data: {file: vm.file}
        }).then(function (resp) {
          vm.almacen.aImagen = ((resp || {}).data || {}).filename || '';
          vm.submit();
        });
      }
    };

    Restangular.all('propietarios').getList().then(function(resp) {
      vm.propietarios = (resp || []);
    });
  }
})();
