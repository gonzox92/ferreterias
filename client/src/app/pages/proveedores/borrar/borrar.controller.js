(function () {
  'use strict';

  angular.module('BlurAdmin.pages.proveedores')
    .controller('ProveedoresBorrarController', ProveedoresBorrarController);

  ProveedoresBorrarController.$inject = ['$uibModalInstance'];
  function ProveedoresBorrarController($uibModalInstance) {
    var vm = this;
    
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }


})();
