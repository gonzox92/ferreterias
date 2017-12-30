(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosRegistroController', propietariosRegistroController);

  propietariosRegistroController.$inject = ['$q', '$log', '$state', '$scope', '$rootScope', 'serverAPI', 'Restangular', 'toastr'];
  function propietariosRegistroController($q, $log, $state, $scope, $rootScope, serverAPI, Restangular, toastr) {
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

    vm.isValidCI = true

    vm.checkUser = function(ci) {
      var deferred = $q.defer();
      Restangular.all('usuarios').customGET('', { sql: 'ci = \'' + ci + '\'' })
        .then(function(resp) {
          deferred.resolve(resp.length === 0);
        }, function() {
          defer.reject(false);
        });

      return deferred.promise;
    };

    vm.checkCI = function() {
      if (vm.propietario.pCI) {
        vm.checkUser(vm.propietario.pCI).then(function(isValid) {
          vm.isValidCI = isValid
        });
      }
    };

    vm.submit = function(isValid) {
      if (!isValid || !vm.isValidCI) {
        return;
      }

      var apellidos = vm.propietario.pApellidos.split(' ');
      var username = vm.propietario.pCI;

      var newUser = {
        name: username,
        email: vm.propietario.email,
        password: vm.propietario.pCI,
        privilegio: 'propietario',
        ci: vm.propietario.pCI
      };

      vm.checkUser(newUser.ci).then(function(isValid) {
        if (!isValid) {
          toastr.warning('El CI ya se encuentra registrado');
          return;
        }

        $rootScope.$pageIsUpdating = true;

        Restangular.all('usuarios').post(newUser).then(function (user) {
          $log.log('Nuevo Usuario > Propietario ha sido creado');

          vm.propietario.idUser = user.id;
            serverAPI.propietarios.post(vm.propietario).then(function(resp) {
              $rootScope.$pageIsUpdating = false;
              $state.go('propietarios.listar');
            });
          }, function() {
            $rootScope.$pageIsUpdating = false;
          });
      }, function() {
        toastr.error('Error verificando perfil', 'Error');
        $rootScope.$pageIsUpdating = false;
      });
    };
  }
})();
