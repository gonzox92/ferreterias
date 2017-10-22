(function () {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
      .controller('ProveedoresListaController', ProveedoresListaController);

  ProveedoresListaController.$inject = ['$log', '$state', '$uibModal', '$rootScope', 'localStorageService', 'serverAPI', 'Restangular'];
  function ProveedoresListaController($log, $state, $uibModal, $rootScope, localStorageService, serverAPI, Restangular) {
    $log.log('ProveedoresListaController');
    var vm = this;

    vm.user = localStorageService.get('user');
    vm.proveedores = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;

    vm.goTo = function(id) {
      $state.go('proveedores.item', {id: id});
    };

    vm.remove = function ($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/proveedores/borrar/borrar.template.html',
        controller: 'ProveedoresBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('proveedores', id).remove().then(function() {
          vm.proveedores.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.buscar = function () {
      vm.isLoading = false;
      Restangular.all('proveedores').customGET('', vm.busqueda).then(function (resp) {
        vm.proveedores = (resp || []).map(function(item) {
          item.pLogo = item.pLogo.indexOf('http://') >= 0 || item.pLogo.indexOf('https://') >= 0 ?
            item.pLogo : $rootScope.baseURL + 'api/fileentry/get/' + item.pLogo;
          return item;
        });
        vm.isLoading = true;
      });
    };
    
    Restangular.all('proveedores').getList().then(function (resp) {
      vm.proveedores = (resp || []).map(function(item) {
        item.pLogo = item.pLogo.indexOf('http://') >= 0 || item.pLogo.indexOf('https://') >= 0 ?
          item.pLogo : $rootScope.baseURL + 'api/fileentry/get/' + item.pLogo;
        return item;
      });
      vm.isLoading = true;
    });
  }
})();
