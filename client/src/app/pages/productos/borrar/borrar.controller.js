(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosBorrarController', productosBorrarController);

  productosBorrarController.$inject = ['$uibModalInstance', 'entity'];
  function productosBorrarController($uibModalInstance, entity) {
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
