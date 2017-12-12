(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('almacenesRegistroController', almacenesRegistroController);

  almacenesRegistroController.$inject = ['$log', '$state', '$rootScope', '$scope', 'localStorageService', 'serverAPI', 'Restangular', 'Upload'];
  function almacenesRegistroController($log, $state, $rootScope, $scope, localStorageService, serverAPI, Restangular, Upload) {
    $log.log('productosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user');
    vm.progress = 10;

    vm.propietarios = [];
    vm.almacen = {
      idPropietario: 0,
      aNombre: '',
      aImagen: '',
      aDireccion: '',
      aUbicacion: '',
      aHorario: '',
      aEntrega: 'recoge'
    };

    $scope.$on('mapInitialized', function(evt, evtMap) {
      vm.map = evtMap;
    });

    vm.submit = function() {
      var currentPosition = vm.map.markers[0].getPosition();
      vm.almacen.aUbicacion = '[' + currentPosition.lat() + ',' + currentPosition.lng() + ']';
      vm.almacen.idPropietario = vm.user.privilegio !== 'administrador' ?
        vm.user.propietario.id : vm.almacen.idPropietario;

      serverAPI.almacenes.post(vm.almacen).then(function(resp) {
        $state.go('almacenes.listar');
        $rootScope.$pageIsUpdating = false;
      }, function() {
        $rootScope.$pageIsUpdating = false;
      });
    };

    vm.upload = function(files) {
      $rootScope.$pageIsUpdating = true;
      if (vm.file && !vm.file.$error) {
        if (_.isObject(vm.file) && !vm.file.$error) {
          var timestamp = Number(new Date());
          var storageRef = firebase.storage().ref(timestamp.toString());
          var uploadTask = storageRef.put(vm.file);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
              vm.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + vm.progress + '% done');
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
              vm.almacen.aImagen = uploadTask.snapshot.downloadURL;
              vm.submit();
            });
        } else {
          vm.submit();
        }
      } else {
        vm.submit();
      }
    };

    Restangular.all('propietarios').getList().then(function(resp) {
      vm.propietarios = (resp || []);
    });
  }
})();
