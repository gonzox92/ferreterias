(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosRegistroController', propietariosRegistroController);

  propietariosRegistroController.$inject = ['$log', '$state', '$scope', 'serverAPI', 'Restangular'];
  function propietariosRegistroController($log, $state, $scope, serverAPI, Restangular) {
    $log.log('propietariosRegistroController');
    var vm = this;
    
    vm.propietario = {
      idUser: 0,
      pCI: '',
      pNombre: '',
      pApellidos: '',
      pDireccion: '',
      pTelefono: ''
    };

    vm.submit = function() {
      var apellidos = vm.propietario.pApellidos.split(' ');
      var username = vm.propietario.pCI;

      var newUser = {
        name: username,
        email: '-',
        password: username,
        privilegio: 'propietario'
      };

      Restangular.all('usuarios').post(newUser).then(function (user) {
        $log.log('Nuevo Usuario > Propietario ha sido creado');

        vm.propietario.idUser = user.id;
        serverAPI.propietarios.post(vm.propietario).then(function(resp) {
          $state.go('propietarios.listar');
        });
      });
    }
  }
})();
