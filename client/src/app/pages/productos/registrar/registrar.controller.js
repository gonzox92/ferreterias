(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosRegistroController', productosRegistroController);

  productosRegistroController.$inject = ['$log', '$state', '$stateParams', '$rootScope', '$uibModal', 'serverAPI', 'Restangular', 'localStorageService', 'Upload'];
  function productosRegistroController($log, $state, $stateParams, $rootScope, $uibModal, serverAPI, Restangular, localStorageService, Upload) {
    $log.log('productosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};

    vm.isValidUPC = true;
    vm.proveedores = [];
    vm.producto = {
      UPC: '',
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
        $state.go('categories_productos', $stateParams);
        $rootScope.$pageIsUpdating = false;
      }, function() {
        $rootScope.$pageIsUpdating = false;
      });
    };

    vm.upload = function(isValid) {
      if (!isValid || !vm.isValidUPC) {
        return;
      }

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

    vm.openUPC = function() {
      var upcModal = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/upc/buscador/buscador.template.html',
        controller: 'UPCBuscadorController',
        controllerAs: 'vm',
        resolve: {}
      });

      upcModal.result.then(function(upc) {
       vm.producto.UPC = upc.id;
       vm.isValidUPC = true;
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.checkUPC = function() {
      Restangular.all('upc').customGET('', { id: vm.producto.UPC })
        .then(function(resp) {
          vm.isValidUPC = !_.isEmpty((resp || {}).data || []);
        });
    };

    Restangular.all('all-proveedores').getList().then(function(resp) {
      vm.proveedores = resp || [];
    });
  }
})();
