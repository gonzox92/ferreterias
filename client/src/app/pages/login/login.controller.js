(function () {
  'use strict';

  angular.module('BlurAdmin.pages.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$state', '$rootScope', 'Restangular', 'localStorageService', 'toastr'];
  function LoginController($scope, $state, $rootScope, Restangular, localStorageService, toastr) {
    var vm = this;
    vm.user = {username: '', password: ''};

    vm.login = function () {
      localStorageService.set('user', null);

      Restangular.one('usuarios').customPOST(vm.user, 'login').then(function (resp) {
        if (resp.user) {
          var url = window.location.href.replace(window.location.hash, '');
          localStorageService.set('user', resp.user);
          $rootScope.$isLogged = true;
          $rootScope.reloadMenuItems();
          $rootScope.updateProfileImage(resp.user.imagen);
          $rootScope.updateProfileName(resp.user.name);

          if (resp.user.nuevo) {
            $state.go('login_wizard');
            return;
          }

          if (resp.user.privilegio === 'administrador') {
            $state.go('dashboard.global');
          }
          if (resp.user.privilegio === 'vendedor') {
            $state.go('buscador');
          }
          if (resp.user.privilegio === 'propietario') {
            $state.go('dashboard.global');
          }
        } else {
          toastr.error('Usuario y/o contraseña incorrectos', 'Login');
        }
      }, function() {
        toastr.error('Usuario y/o contraseña incorrectos', 'Login');
      });
    };
  }
})();
