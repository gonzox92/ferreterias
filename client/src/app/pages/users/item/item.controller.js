(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
    .controller('UserController', UserController);

  UserController.$inject = ['$state', '$stateParams', '$log', 'Restangular', 'localStorageService', 'toastr'];
  function UserController($state, $stateParams, $log, Restangular, localStorageService, toastr) {
    $log.log('UserController');
    var vm = this;
    vm.user = {};
    vm.nombre = '';
    vm.apellidos = '';

    vm.updateProfile = function (message) {
      var user = {
        id: 4,
        name: vm.user.name,
        email: vm.user.email,
        password: vm.user.password,
        privilegio: vm.user.privilegio,
      };

      Restangular.one('usuarios', $stateParams.id).customPUT(user).then(function (resp) {
        toastr.success(message || 'Informacion ha sido actualizada correctamente');
      });
    };

    vm.resetPassword = function () {
      vm.user.password = vm.user.name;
      vm.updateProfile('La contraseña ha sido reseteada correctamente');
    };

    Restangular.one('usuarios', $stateParams.id).get().then(function (resp) {
      vm.user = _.clone(resp);

      var propietario = vm.user.propietario || {};
      var vendedor = vm.user.vendedor || {};

      vm.nombre = !_.isEmpty(propietario) ? propietario.pNombre : vendedor.vNombre;
      vm.apellidos = !_.isEmpty(propietario) ? propietario.pApellidos : vendedor.vApellidos;
    });
  }
})();
