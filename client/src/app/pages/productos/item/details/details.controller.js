(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosItemDetailController', productosItemDetailController);

  productosItemDetailController.$inject = ['$rootScope', '$stateParams', 'serverAPI', 'Restangular', 'toastr'];
  function productosItemDetailController($rootScope, $stateParams, serverAPI, Restangular, toastr) {
    var vm = this;
    vm.producto = {};

    serverAPI.productos.get($stateParams.idProducto).then(function(resp) {
      vm.producto = {
        id: resp.id,
        pNombre: resp.pNombre || '',
        pDescripcion: resp.pDescripcion || '',
        pImagen: resp.pImagen || '/assets/pictures/empty.png',
        pPrecio: resp.pPrecio || 0,
        pCantidadEnMano: resp.pCantidadEnMano || 0
      };
    });

    vm.submit = function() {
      // var currentPosition = vm.map.markers[0].getPosition();
      // vm.almacen.aUbicacion = '[' + currentPosition.lat() + ',' + currentPosition.lng() +  ']';

      Restangular.one('productos', vm.producto.id).customPUT(vm.producto).then(function(resp) {
        toastr.success('Datos actualizados correctamente', 'Actualizado');
        // $state.go('almacenes.listar');
        $rootScope.$pageIsUpdating = false;
      }, function() {
        toastr.error('Error actualizando Producto');
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
            vm.producto.pImagen = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      } else {
        vm.submit();
      }
    };

    vm.remove = function() {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/borrar/borrar.template.html',
        controller: 'productosBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('productos', vm.producto.id).remove().then(function() {
          $state.go('categories', {id: vm.producto.almacen.id});
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };
  }
})();
