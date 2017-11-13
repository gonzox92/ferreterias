(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosRegistroController', productosRegistroController);

  productosRegistroController.$inject = ['$log', '$state', '$stateParams', '$rootScope', 'serverAPI', 'Restangular', 'localStorageService', 'Upload'];
  function productosRegistroController($log, $state, $stateParams, $rootScope, serverAPI, Restangular, localStorageService, Upload) {
    $log.log('productosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};

    vm.proveedores = [];
    vm.producto = {
      idProveedor: 0,
      idAlmacen: $stateParams.id,
      idCategoria: $stateParams.idCategoria,
      pNombre: '',
      pDescripcion: '',
      pImagen: '/assets/pictures/empty.png',
      pPrecio: 0,
      pCantidadEnMano: 0
    };

    vm.submit = function() {
      serverAPI.productos.post(vm.producto).then(function(resp) {
        // if (vm.user.privilegio === 'vendedor') {
        //   $state.go('productos_almacen');
        // } else {
        //   $state.go('productos', {id: $stateParams.id});
        // }

        $state.go('categories_productos', $stateParams)
      });
    };

    vm.upload = function(files) {
      // if (!vm.file.$error) {
      //   Upload.upload({
      //     url: $rootScope.baseURL + 'api/fileentry/add',
      //     data: {file: vm.file}
      //   }).then(function(resp) {
      //     vm.producto.pImagen = ((resp || {}).data || {}).filename || '';
      //     vm.submit();
      //   });
      // }
      if (!vm.file.$error) {
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
      }
    };

    Restangular.all('proveedores').getList().then(function(resp) {
      vm.proveedores = resp || [];
    });
  }
})();
