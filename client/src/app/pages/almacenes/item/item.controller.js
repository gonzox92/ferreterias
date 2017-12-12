(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('almacenesItemController', almacenesItemController);

  almacenesItemController.$inject = ['$log', '$scope', '$state', '$stateParams', '$uibModal', '$rootScope',
    'Restangular', 'serverAPI', 'toastr', 'localStorageService'];
  function almacenesItemController($log, $scope, $state, $stateParams, $uibModal, $rootScope, Restangular,
                                   serverAPI, toastr, localStorageService) {
    $log.log('almacenesItemController');
    var vm = this;
    vm.progress = 10;
    vm.almacen = {};
    vm.propietarios = [];
    vm.user = localStorageService.get('user');

    $scope.$on('mapInitialized', function(evt, evtMap) {
      vm.map = evtMap;
    });

    vm.remove = function() {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/almacenes/borrar/borrar.template.html',
        controller: 'almacenesBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('almacenes', vm.almacen.id).remove().then(function() {
          $state.go('almacenes');
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.submit = function() {
      var currentPosition = vm.map.markers[0].getPosition();
      vm.almacen.aUbicacion = '[' + currentPosition.lat() + ',' + currentPosition.lng() + ']';

      Restangular.one('almacenes', vm.almacen.id).customPUT(vm.almacen).then(function(resp) {
        $rootScope.$pageIsUpdating = false;
        toastr.success('Datos actualizados correctamente', 'Actualizado');
        $state.go('almacenes.listar');
      }, function() {
        toastr.error('Error actualizando Ferreteria');
        $rootScope.$pageIsUpdating = false;
      });
    };

    vm.upload = function(files) {
      $rootScope.$pageIsUpdating = true;

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
    };

    serverAPI.almacenes.get($stateParams.id).then(function(resp) {
      vm.almacen = {
        id: resp.id,
        aNombre: resp.aNombre || '',
        aImagen: resp.aImagen || '/assets/pictures/empty.png',
        aDireccion: resp.aDireccion || '',
        aUbicacion: resp.aUbicacion || 'current-location',
        aHorario: resp.aHorario,
        idPropietario: resp.idPropietario
      };
    });

    Restangular.all('propietarios').getList().then(function(resp) {
      vm.propietarios = (resp || []);
    });
  }
})();
