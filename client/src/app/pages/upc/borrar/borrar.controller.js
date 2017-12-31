(function() {
  'use strict';

  angular.module('BlurAdmin.pages.upc')
    .controller('UPCBorrarController', UPCBorrarController);

  UPCBorrarController.$inject = ['$uibModalInstance', 'entity'];
  function UPCBorrarController($uibModalInstance, entity) {
    var vm = this;
    vm.entity = entity;

    vm.ok = function() {
      $uibModalInstance.close();
    };

    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
