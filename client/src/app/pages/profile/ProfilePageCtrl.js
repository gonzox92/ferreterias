/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  ProfilePageCtrl.$inject = ['$scope', '$rootScope', 'fileReader', '$filter', '$uibModal', 
    'localStorageService', 'Restangular', 'toastr', 'Upload'];
  function ProfilePageCtrl($scope, $rootScope, fileReader, $filter, $uibModal,
    localStorageService, Restangular, toastr, Upload) {
    var vm = this;

    vm.user = localStorageService.get('user');
    vm.password2 = vm.user.password;

    console.log(vm.user)

    vm.submit = function() {
      var user = {
        email: vm.user.email,
        name: vm.user.name,
        nombreCompleto: vm.user.nombreCompleto,
        password: vm.user.password,
        privilegio: vm.user.privilegio,
        imagen: vm.user.imagen
      }

      if (vm.user.password !== vm.password2) {
        toastr.error('Las contraseñas no coinciden', 'Error');
        return;
      }

      Restangular.one('usuarios', vm.user.id).customPUT(vm.user).then(function (resp) {
        toastr.success('El perfil fue actualizado correctamente', 'Perfil');
        $rootScope.updateProfileImage(vm.user.imagen);
        localStorageService.set('user', vm.user);
      }, function () {
        toastr.error('Error al actualizando el perfil', 'Error');
      })
    };

    vm.updateProfile = function (files) {
      if (_.isObject(vm.user.imagen) && !vm.user.imagen.$error) {
        Upload.upload({
          url: $rootScope.baseURL + 'api/fileentry/add',
          data: {file: vm.user.imagen}
        }).then(function (resp) {
          vm.user.imagen = ((resp || {}).data || {}).filename || '';
          vm.submit();
        });
      } else {
        vm.submit();
      }
    };

    vm.getProfileImage = function() {
      return vm.user.imagen ? _.isObject(vm.user.imagen) ? vm.user.imagen : 
        ($rootScope.baseURL + 'api/fileentry/get/' + vm.user.imagen) :
        '/assets/img/app/profile/empty-profile.png'
    }
  }
})();
