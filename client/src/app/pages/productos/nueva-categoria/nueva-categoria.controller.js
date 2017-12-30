(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('nuevaCategoriaController', nuevaCategoriaController);

  nuevaCategoriaController.$inject = ['$rootScope', '$stateParams', '$uibModalInstance', 'Restangular', 'isCategory', 'parent', 'entity'];
  function nuevaCategoriaController($rootScope, $stateParams, $uibModalInstance, Restangular, isCategory, parent, oldEntity) {
    var vm = this;

    vm.isCategory = isCategory;
    vm.parent = parent;
    vm.label = isCategory ? 'categoria' : 'sub-categoria';
    vm.isOld = oldEntity !== null;
    vm.entity = {
      name: oldEntity ? oldEntity.cNombre || oldEntity.scNombre : '',
      image: oldEntity ? oldEntity.cImagen : '/assets/pictures/empty.png'
    };

    console.log(oldEntity)
    vm.submit = function() {
      var endpoint = vm.isCategory ? 'categorias' : 'subcategorias';
      var newEntity = {
        id: oldEntity ? oldEntity.id : shortid.gen(),
        idAlmacen: $stateParams.id
      };

      if (vm.isCategory) {
        newEntity.cNombre = vm.entity.name;
        newEntity.cImagen = vm.entity.image; 
      } else {
        newEntity.idCategoria = vm.parent.id;
        newEntity.cNombre = vm.entity.name;
        newEntity.scNombre = vm.entity.name;
        newEntity.qtyProductos = oldEntity ? oldEntity.qtyProductos || 0 : 0;
      }

      if (oldEntity) {
        Restangular.one(endpoint, oldEntity.id).customPUT(newEntity).then(function(resp) {
          $uibModalInstance.close(newEntity);
          $rootScope.$pageIsUpdating = false;
        }, function() {
          $rootScope.$pageIsUpdating = false;
        })
      } else {
        Restangular.all(endpoint).post(newEntity).then(function(resp) {
          $uibModalInstance.close(resp);
          $rootScope.$pageIsUpdating = false;
        }, function() {
          $rootScope.$pageIsUpdating = false;
        });
      }
    };

    vm.upload = function(isValid) {
      if (!isValid) {
        return;
      }

      $rootScope.$pageIsUpdating = true;

      if (vm.file && !vm.file.$error) {
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
            vm.entity.image = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      } else {
        vm.submit();
      }
    };
  }
})();
