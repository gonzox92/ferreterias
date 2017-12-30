(function () {
  'use strict';

  angular.module('BlurAdmin.pages.vendedores')
      .controller('vendedoresRegistroController', vendedoresRegistroController);

  vendedoresRegistroController.$inject = ['$q', '$log', '$state', '$stateParams', '$rootScope', '$scope', 'serverAPI', 'Restangular', 'localStorageService', 'toastr'];
  function vendedoresRegistroController($q, $log, $state, $stateParams, $rootScope, $scope, serverAPI, Restangular, localStorageService, toastr) {
    $log.log('propietariosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.isValidCI = true
    vm.vendedor = {
      idUser: 0,
      idAlmacen: 0,
      vCI: '',
      vNombre: '',
      vApellidos: '',
      vDireccion: '',
      vTelefono: ''
    };

    // Restangular.one('propietarios', vm.user.propietario.id).customGET('almacenes').then(function (resp) {
    //   vm.almacenes = (resp || {}).almacenes || [];
    // });

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
      if (vm.vendedor.vCI) {
        vm.checkUser(vm.vendedor.vCI).then(function(isValid) {
          vm.isValidCI = isValid
        });
      }
    };

    vm.submit = function(isValid) {
      if (!isValid || !vm.isValidCI) {
        return;
      }

      var apellidos = vm.vendedor.vApellidos.split(' ');
      var username = vm.vendedor.vCI;

      var newUser = {
        name: username,
        email: vm.vendedor.email,
        password: username,
        privilegio: 'vendedor',
        ci: vm.vendedor.pCI
      };

      $rootScope.$pageIsUpdating = true;

      Restangular.all('usuarios').post(newUser).then(function (user) {
        $log.log('Nuevo Usuario > Vendedor ha sido creado');

        vm.vendedor.idUser = user.id;
        vm.vendedor.idAlmacen = $stateParams.id;

        Restangular.all('vendedores').post(vm.vendedor).then(function(resp) {
          $state.go('almacenes_item_vendedores', {id: $stateParams.id});
          $rootScope.$pageIsUpdating = false;
        }, function() {
          toastr.error('Error registrando Vendedor', 'Error');
          $rootScope.$pageIsUpdating = false;
        });
      });
    };
  }
})();
