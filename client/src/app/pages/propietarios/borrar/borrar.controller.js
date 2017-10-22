(function () {
  'use strict';

  angular.module('BlurAdmin.pages.propietarios')
      .controller('propietariosBorrarController', propietariosBorrarController);

  propietariosBorrarController.$inject = ['$uibModalInstance'];
  function propietariosBorrarController($uibModalInstance) {
    var vm = this;
    
    vm.ok = function () {
      $uibModalInstance.close();
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }


})();
