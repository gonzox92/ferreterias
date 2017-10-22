(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
      .controller('almacenesBorrarController', almacenesBorrarController);

  almacenesBorrarController.$inject = ['$uibModalInstance'];
  function almacenesBorrarController($uibModalInstance) {
    var vm = this;
    
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }


})();
