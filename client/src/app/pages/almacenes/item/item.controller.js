(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
      .controller('almacenesItemController', almacenesItemController);

  almacenesItemController.$inject = ['$log', '$state', '$stateParams', '$uibModal', '$rootScope',
    'Restangular', 'serverAPI', 'toastr'];
  function almacenesItemController($log, $state, $stateParams, $uibModal, $rootScope, Restangular,
    serverAPI, toastr) {
    $log.log('almacenesItemController');
    var vm = this;
    vm.almacen = {};

    vm.remove = function () {
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
      Restangular.one('almacenes', vm.almacen.id).customPUT(vm.almacen).then(function(resp) {
        toastr.success('Datos actualizados correctamente', 'Actualizado');
        $state.go('almacenes.listar');
      }, function() {
        toastr.error('Error actualizando Ferreteria');
      });
    };

    vm.upload = function (files) {
      if (_.isObject(vm.file) && !vm.file.$error) {
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
            vm.almacen.aImagen = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      } else {
        vm.submit();
      }
    };
    
    serverAPI.almacenes.get($stateParams.id).then(function (resp) {      
      vm.almacen = {
        id: resp.id,
        aNombre: resp.aNombre || '',
        aImagen: resp.aImagen || '/assets/pictures/empty.png',
        aDireccion: resp.aDireccion || '',
        aUbicacion: resp.aUbicacion || 'current-location'
      };
    })
  }
})();
