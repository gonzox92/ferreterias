(function () {
  'use strict';

  angular.module('BlurAdmin.pages.upc')
      .controller('UPCItemController', UPCItemController);

  UPCItemController.$inject = ['$log', '$state', '$stateParams', '$uibModal', 'Restangular', 'toastr'];
  function UPCItemController($log, $state, $stateParams, $uibModal, Restangular, toastr) {
    $log.log('UPCItemController');
    var vm = this;
    vm.upc = {};
    vm.isValid = true;
    vm.id = '';

    vm.update = function(isValid) {
      if (!isValid) {
        return;
      }

      Restangular.one('upc', vm.upc.id).customPUT(vm.upc).then(function (resp) {
        toastr.success('UPC ha sido actualizado');
        $state.go('upc.listar');
      }, function() {
        toastr.error('UPC no pudo ser actualizado', 'Error');
      });
    };

    vm.checkCode = function() {
      if (vm.upc.id !== vm.id) {
        Restangular.all('upc').customGET('', { id: vm.upc.id })
          .then(function(resp) {
            vm.isValid = _.isEmpty((resp || {}).data || []);
          });
      }
    };

    vm.remove = function ($) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/upc/borrar/borrar.template.html',
        controller: 'UPCBorrarController',
        controllerAs: 'vm',
        resolve: {
          entity: function() {
            return {title: 'UPC', name: vm.upc.nombre};
          }
        }
      });

      deleteMessage.result.then(function() {
        Restangular.one('upc', vm.upc.id).remove().then(function() {
          toastr.success('UPC ha sido elimado');
          $state.go('upc.listar');
        }, function() {
          toastr.error('Error al eliminar UPC', 'Error');
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };
    
    Restangular.one('upc', $stateParams.id).get().then(function (resp) {
      vm.upc = {
        id: resp.id,
        nombre: resp.nombre || ''
      };

      vm.id = _.clone(vm.upc.id);
    });
  }
})();
