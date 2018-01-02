(function () {
  'use strict';

  angular.module('BlurAdmin.pages.buscador')
    .controller('buscadorProductDetailInfoController', buscadorProductDetailInfoController);

  buscadorProductDetailInfoController.$inject = ['$log', '$timeout', '$uibModal', '$uibModalInstance', 'Restangular', 'item'];
  function buscadorProductDetailInfoController($log, $timeout, $uibModal, $uibModalInstance, Restangular, item) {
    var vm = this;

    vm.item = item;
    vm.center = vm.item.aUbicacion.substr(1).slice(0, -1).split(',').map(function(point) {
      return +point;
    });

    $timeout(function() {
      vm.showMap = true;
    }, 200);

    vm.closeDialog = function() {
      $uibModalInstance.dismiss();
    };
  }
})();
