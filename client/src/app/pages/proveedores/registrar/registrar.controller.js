(function () {
  'use strict';

  angular.module('BlurAdmin.pages.proveedores')
      .controller('ProveedoresRegistroController', ProveedoresRegistroController);

  ProveedoresRegistroController.$inject = ['$log', '$state', '$scope', '$rootScope', 'localStorageService', 'Restangular', 'Upload'];
  function ProveedoresRegistroController($log, $state, $scope, $rootScope, localStorageService, Restangular, Upload) {
    $log.log('ProveedoresRegistroController');
    var vm = this;
    var user = localStorageService.get('user');
    
    vm.proveedor = {
      idUser: 0,
      pNombre: '',
      pLogo: '',
      pDescripcion: ''
    };

    vm.submit = function() {
      Restangular.all('proveedores').post(vm.proveedor).then(function(resp) {
        $state.go('proveedores.listar');
      });
    };

    vm.upload = function (files) {
      if (!vm.file.$error) {
        var timestamp = Number(new Date());
        var storageRef = firebase.storage().ref(timestamp.toString());
        var uploadTask = storageRef.put(vm.file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            $log.error(error.code);
          }, function() {
            vm.proveedor.pLogo = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      }
    };
  }
})();
