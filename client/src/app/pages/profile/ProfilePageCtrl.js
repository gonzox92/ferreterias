/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  ProfilePageCtrl.$inject = ['$log', '$scope', '$rootScope', 'fileReader', '$filter', '$uibModal', 
    'localStorageService', 'Restangular', 'toastr', 'Upload'];
  function ProfilePageCtrl($log, $scope, $rootScope, fileReader, $filter, $uibModal,
    localStorageService, Restangular, toastr, Upload) {
    var vm = this;

    vm.user = localStorageService.get('user');
    vm.password2 = vm.user.password;

    // console.log(vm.user)

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
        $rootScope.$pageIsUpdating = false;
      }, function () {
        toastr.error('Error al actualizando el perfil', 'Error');
        $rootScope.$pageIsUpdating = false;
      })
    };

    vm.updateProfile = function (files) {
      $rootScope.$pageIsUpdating = true;

      if (_.isObject(vm.user.imagen) && !vm.user.imagen.$error) {
        var timestamp = Number(new Date());
        var storageRef = firebase.storage().ref(timestamp.toString());
        var uploadTask = storageRef.put(vm.user.imagen);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                $log.error('UNAUTHORIZED');
                break;

              case 'storage/canceled':
                // User canceled the upload
                $log.error('CANCELED');
                break;

              case 'storage/unknown':
                $log.error('UNKNOWN');
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, function() {
            // Upload completed successfully, now we can get the download URLSa
            vm.user.imagen = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      } else {
        vm.submit();
      }
    };

    vm.getProfileImage = function() {
      var defaultImage =  '/assets/img/app/profile/empty-profile.png';
      // return defaultImage;
      return vm.user.imagen ? _.isObject(vm.user.imagen) ? vm.user.imagen : 
        vm.user.imagen.startsWith('http') ? vm.user.imagen : defaultImage : defaultImage;
    }
  }
})();
