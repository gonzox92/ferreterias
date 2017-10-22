(function () {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
      .controller('productosBorrarController', productosBorrarController);

  productosBorrarController.$inject = ['$uibModalInstance'];
  function productosBorrarController($uibModalInstance) {
    var vm = this;
    
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }


})();
