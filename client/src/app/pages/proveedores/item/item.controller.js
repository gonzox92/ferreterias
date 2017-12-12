(function () {
  'use strict';

  angular.module('BlurAdmin.pages.proveedores')
    .controller('ProveedoresItemController', ProveedoresItemController);

  ProveedoresItemController.$inject = ['$log', '$state', '$stateParams', '$uibModal', '$rootScope', 'Restangular', 'serverAPI', 'toastr'];
  function ProveedoresItemController($log, $state, $stateParams, $uibModal, $rootScope, Restangular, serverAPI, toastr) {
    $log.log('ProveedoresItemController');
    var vm = this;
    vm.proveedor = {};

    vm.remove = function () {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/proveedores/borrar/borrar.template.html',
        controller: 'ProveedoresBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('proveedores', vm.proveedor.id).remove().then(function() {
          $state.go('proveedores.listar');
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };
    
    Restangular.one('proveedores', $stateParams.id).get().then(function (resp) {
      vm.proveedor = {
        id: resp.id,
        pNombre: resp.pNombre || '',
        pLogo: resp.pLogo || '/assets/pictures/empty.png',
        pDescripcion: resp.pDescripcion || ''
      };
    });

    vm.submit = function() {
      Restangular.one('proveedores', vm.proveedor.id).customPUT(vm.proveedor).then(function(resp) {
        toastr.success('Datos actualizados correctamente', 'Actualizado');
        $state.go('proveedores.listar');
        $rootScope.$pageIsUpdating = false;
      }, function() {
        toastr.error('Error actualizando Proveedor');
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
            vm.proveedor.pLogo  = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      } else {
        vm.submit();
      }
    };
  }
})();
