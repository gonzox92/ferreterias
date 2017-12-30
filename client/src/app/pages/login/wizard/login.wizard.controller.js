(function () {
  'use strict';

  angular.module('BlurAdmin.pages.login')
    .controller('LoginWizardController', LoginWizardController);

    LoginWizardController.$injec = ['localStorageService', '$rootScope', 'Restangular', 'toastr', '$state'];
  function LoginWizardController(localStorageService, $rootScope, Restangular, toastr, $state) {
    var vm = this;
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})")

    vm.personalInfo = {};
    vm.accountInfo = {};
    vm.user = localStorageService.get('user');
    vm.isPasswordValid = true;

    vm.loadPersonalInfo = function() {
      if (vm.user.privilegio === 'propietario') {
        vm.personalInfo.ci = vm.user.propietario.pCI;
        vm.personalInfo.nombre = vm.user.propietario.pNombre;
        vm.personalInfo.apellidos = vm.user.propietario.pApellidos;
        vm.personalInfo.direccion = vm.user.propietario.pDireccion;
        vm.personalInfo.telefono = vm.user.propietario.pTelefono;
      } else if (vm.user.privilegio === 'vendedor') {
        vm.personalInfo.ci = vm.user.vendedor.vCI;
        vm.personalInfo.nombre = vm.user.vendedor.vNombre;
        vm.personalInfo.apellidos = vm.user.vendedor.vApellidos;
        vm.personalInfo.direccion = vm.user.vendedor.vDireccion;
        vm.personalInfo.telefono = vm.user.vendedor.vTelefono;
      }
    };

    vm.loadAccountInfo = function() {
      vm.accountInfo.username = vm.user.name;
      vm.accountInfo.email = vm.user.email;
      vm.accountInfo.password = '';
      vm.accountInfo.confirmPassword = '';
    };

    vm.areAccountInfoPasswordsEqual = function () {
      return vm.accountInfo.confirmPassword && vm.accountInfo.password == vm.accountInfo.confirmPassword;
    };

    vm.validatePassword = function() {
      vm.isPasswordValid = mediumRegex.test(vm.accountInfo.password);
    };

    vm.redirect = function() {      
      if (vm.user.privilegio === 'administrador') {
        $state.go('dashboard.global');
      }
      if (vm.user.privilegio === 'vendedor') {
        $state.go('buscador');
      }
      if (vm.user.privilegio === 'propietario') {
        $state.go('dashboard.global');
      }
    };

    vm.updateInfo = function() {
      return function() {
        var endpoint = vm.user.privilegio === 'propietario' ? 'propietarios' : 'vendedores';
        var id = vm.user[vm.user.privilegio].id;
        var entity = {};

        if (vm.user.privilegio === 'propietario') {
          vm.user.propietario.pCI = vm.personalInfo.ci;
          vm.user.propietario.pNombre = vm.personalInfo.nombre;
          vm.user.propietario.pApellidos = vm.personalInfo.apellidos ;
          vm.user.propietario.pDireccion = vm.personalInfo.direccion;
          vm.user.propietario.pTelefono = vm.personalInfo.telefono;
        } else if (vm.user.privilegio === 'vendedor') {
          vm.user.vendedor.vCI = vm.personalInfo.ci;
          vm.user.vendedor.vNombre = vm.personalInfo.nombre;
          vm.user.vendedor.vApellidos = vm.personalInfo.apellidos;
          vm.user.vendedor.vDireccion = vm.personalInfo.direccion;
          vm.user.vendedor.vTelefono = vm.personalInfo.telefono;
        }

        entity = vm.user.privilegio === 'propietario' ? vm.user.propietario : vm.user.vendedor;
        $rootScope.$pageIsUpdating = true;
        
        Restangular.one(endpoint, id).customPUT(entity).then(function(resp) {
          vm.user.nuevo = false;
          vm.user.password = vm.accountInfo.password;
          
          Restangular.one('usuarios', vm.user.id).customPUT(vm.user).then(function(resp) {
            toastr.success('El perfil fue actualizado correctamente', 'Perfil');
            localStorageService.set('user', vm.user);
            $rootScope.$pageIsUpdating = false;

            vm.redirect();
          }, function() {
            $rootScope.$pageIsUpdating = false;
          })
        }, function() {
          toastr.error('Error actualizando cuenta');
          $rootScope.$pageIsUpdating = false;
        });
      }
    };

    vm.loadPersonalInfo();
    vm.loadAccountInfo();
  }
})();
