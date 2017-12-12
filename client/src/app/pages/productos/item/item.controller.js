(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosItemController', productosItemController);

  productosItemController.$inject = ['$log', '$state', '$stateParams', '$rootScope', 'serverAPI', 'Restangular'];
  function productosItemController($log, $state, $stateParams, $rootScope, serverAPI, Restangular) {
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

    vm.load = function() {
      Restangular.one('productos', $stateParams.idProducto).get().then(function(resp) {
        vm.producto = resp;
      });

      Restangular.all('proveedores').getList().then(function(resp) {
        vm.proveedores = resp || [];
      });
    };

    vm.load();
  }
})();
