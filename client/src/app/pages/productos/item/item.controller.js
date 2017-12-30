(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosItemController', productosItemController);

  productosItemController.$inject = ['$log', '$state', '$stateParams', '$rootScope', '$uibModal', 'serverAPI', 'Restangular', 'toastr'];
  function productosItemController($log, $state, $stateParams, $rootScope, $uibModal, serverAPI, Restangular, toastr) {
    $log.log('productosItemController');
    var vm = this;
    vm.producto = {};
    vm.ferreterias = [];
    vm.cantidades = [];

    vm.tabs = [{
      name: 'Detalles',
      state: 'productos_item.detail'
    }, {
      name: 'Categorias',
      state: 'productos_item.categories'
    }];

    vm.submit = function() {
      Restangular.one('productos', $stateParams.idProducto).customPUT(vm.producto).then(function(resp) {
        $state.go('categories_productos', $stateParams);
        $rootScope.$pageIsUpdating = false;

        toastr.success('Informacion actualizada', 'Producto');        
      }, function() {
        $rootScope.$pageIsUpdating = false;
        toastr.error('Error al actualizar el producto', 'Error');
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
      } else {
        vm.submit();
      }
    };

    vm.remove = function () {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/borrar/borrar.template.html',
        controller: 'productosBorrarController',
        controllerAs: 'vm',
        resolve: {
          entity: function() {
            return {
              title: 'Producto',
              name: vm.producto.pNombre
            }
          }
        }
      });

      deleteMessage.result.then(function() {
        Restangular.one('productos', vm.producto.id).remove().then(function() {
          $state.go('categories_productos', $stateParams);
          toastr.success('Producto ha sido eliminado', 'Producto');
        }, function() {
          toastr.error('Error al eliminar el producto', 'Error');
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.load = function() {
      Restangular.one('productos', $stateParams.idProducto).get().then(function(resp) {
        vm.producto = resp;
      });

      Restangular.all('all-proveedores').getList().then(function(resp) {
        vm.proveedores = resp || [];
      });
    };

    vm.load();
  }
})();
