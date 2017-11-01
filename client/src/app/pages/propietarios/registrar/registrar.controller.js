(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosRegistroController', propietariosRegistroController);

  propietariosRegistroController.$inject = ['$q', '$log', '$state', '$scope', 'serverAPI', 'Restangular', 'toastr'];
  function propietariosRegistroController($q, $log, $state, $scope, serverAPI, Restangular, toastr) {
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

    vm.checkUser = function(email) {
      var deferred = $q.defer();
      Restangular.all('usuarios').customGET('', { sql: 'email = \'' + email + '\'' })
        .then(function(resp) {
          deferred.resolve(resp.length === 0);
        }, function() {
          defer.reject(false);
        });

      return deferred.promise;
    };

    vm.submit = function() {
      var apellidos = vm.propietario.pApellidos.split(' ');
      var username = vm.propietario.pCI;

      var newUser = {
        name: username,
        email: vm.propietario.email,
        password: vm.propietario.email || vm.propietario.pCI,
        privilegio: 'propietario',
      };

      vm.checkUser(newUser.email).then(function(isValid) {
        if (!isValid) {
          toastr.warning('El EMAIL ya se encuentra registrado');
          return;
        }

        Restangular.all('usuarios').post(newUser).then(function (user) {
          $log.log('Nuevo Usuario > Propietario ha sido creado');

          vm.propietario.idUser = user.id;
            serverAPI.propietarios.post(vm.propietario).then(function(resp) {
              $state.go('propietarios.listar');
            });
          });
      }, function() {
        toastr.error('Error verificando perfil', 'Error');
      });
    };
  }
})();
