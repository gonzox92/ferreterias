(function () {
  'use strict';

  angular.module('BlurAdmin.pages.vendedores')
      .controller('vendedoresRegistroController', vendedoresRegistroController);

  vendedoresRegistroController.$inject = ['$log', '$state', '$stateParams', '$scope', 'serverAPI', 'Restangular', 'localStorageService'];
  function vendedoresRegistroController($log, $state, $stateParams, $scope, serverAPI, Restangular, localStorageService) {
    $log.log('propietariosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    
    vm.vendedor = {
      idUser: 0,
      idAlmacen: 0,
      vCI: '',
      vNombre: '',
      vApellidos: '',
      vDireccion: '',
      vTelefono: ''
    };

    Restangular.one('propietarios', vm.user.propietario.id).customGET('almacenes').then(function (resp) {
      vm.almacenes = (resp || {}).almacenes || [];
    });

    vm.submit = function() {
      var apellidos = vm.vendedor.vApellidos.split(' ');
      var username = vm.vendedor.vCI;

      var newUser = {
        name: username,
        email: '-',
        password: username,
        privilegio: 'vendedor'
      };

      Restangular.all('usuarios').post(newUser).then(function (user) {
        $log.log('Nuevo Usuario > Vendedor ha sido creado');

        vm.vendedor.idUser = user.id;
        Restangular.all('vendedores').post(vm.vendedor).then(function(resp) {
          $state.go('almacenes_item_vendedores', {id: $stateParams.id});
        });
      });
    };
  }
})();
