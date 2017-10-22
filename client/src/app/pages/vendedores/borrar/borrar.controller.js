(function () {
  'use strict';

  angular.module('BlurAdmin.pages.vendedores')
      .controller('vendedoresBorrarController', vendedoresBorrarController);

  vendedoresBorrarController.$inject = ['$uibModalInstance'];
  function vendedoresBorrarController($uibModalInstance) {
    var vm = this;
    
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }


})();
