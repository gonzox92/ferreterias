(function () {
  'use strict';

  angular.module('BlurAdmin.pages.upc')
      .controller('UPCRegistroController', UPCRegistroController);

  UPCRegistroController.$inject = ['$log', '$state', '$scope', '$rootScope', 'localStorageService', 'Restangular', 'Upload', 'toastr'];
  function UPCRegistroController($log, $state, $scope, $rootScope, localStorageService, Restangular, Upload, toastr) {
    $log.log('UPCRegistroController');
    var vm = this;
    var user = localStorageService.get('user');
    
    vm.isValid = true;
    vm.upc = {
      id: '',
      nombre: ''
    };

    vm.submit = function() {
      Restangular.all('upc').post(vm.upc).then(function(resp) {
        $state.go('upc.listar');
        $rootScope.$pageIsUpdating = false;
        toastr.success('Codigo UPC ha sido registrado');
      }, function() {
        toastr.error('Error al registrar UPC');
        $rootScope.$pageIsUpdating = false;
      });
    };

    vm.checkCode = function() {
      Restangular.all('upc').customGET('', { id: vm.upc.id })
        .then(function(resp) {
          vm.isValid = _.isEmpty((resp || {}).data || []);
        });
    };

    vm.upload = function (isValid) {
      if (!isValid) {
        return;
      }

      $rootScope.$pageIsUpdating = true;
      vm.submit();
    };
  }
})();
