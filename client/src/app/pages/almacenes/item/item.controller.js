(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
      .controller('almacenesItemController', almacenesItemController);

  almacenesItemController.$inject = ['$log', '$state', '$stateParams', '$uibModal', '$rootScope', 'Restangular', 'serverAPI'];
  function almacenesItemController($log, $state, $stateParams, $uibModal, $rootScope, Restangular, serverAPI) {
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
    
    serverAPI.almacenes.get($stateParams.id).then(function (resp) {
      if (resp.aImagen !== '') {
        resp.aImagen = resp.aImagen.indexOf('http://') >= 0 || resp.aImagen.indexOf('https://') >= 0 ?
          resp.aImagen : $rootScope.baseURL + 'api/fileentry/get/' + resp.aImagen;
      }
      
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
