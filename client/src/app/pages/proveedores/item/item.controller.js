(function () {
  'use strict';

  angular.module('BlurAdmin.pages.proveedores')
    .controller('ProveedoresItemController', ProveedoresItemController);

  ProveedoresItemController.$inject = ['$log', '$state', '$stateParams', '$uibModal', '$rootScope', 'Restangular', 'serverAPI'];
  function ProveedoresItemController($log, $state, $stateParams, $uibModal, $rootScope, Restangular, serverAPI) {
    $log.log('ProveedoresItemController');
    var vm = this;
    vm.proveedor = {};

    // vm.remove = function () {
    //   var deleteMessage = $uibModal.open({
    //     animation: true,
    //     templateUrl: 'app/pages/almacenes/borrar/borrar.template.html',
    //     controller: 'almacenesBorrarController',
    //     controllerAs: 'vm',
    //     resolve: {}
    //   });

    //   deleteMessage.result.then(function() {
    //     Restangular.one('almacenes', vm.almacen.id).remove().then(function() {
    //       $state.go('almacenes');
    //     });
    //   }, function() {
    //     $log.log('Borrar fue cancelado')
    //   });
    // };
    
    Restangular.one('proveedores', $stateParams.id).get().then(function (resp) {
      if (resp.pLogo !== '') {
        resp.pLogo = resp.pLogo.indexOf('http://') >= 0 || resp.pLogo.indexOf('https://') >= 0 ?
          resp.pLogo : $rootScope.baseURL + 'api/fileentry/get/' + resp.pLogo;
      }

      vm.proveedor = {
        id: resp.id,
        pNombre: resp.pNombre || '',
        pLogo: resp.pLogo || '/assets/pictures/empty.png',
        pDescripcion: resp.pDescripcion || ''
      };
    })
  }
})();
