(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('almacenesListaController', almacenesListaController);

  almacenesListaController.$inject = ['$log', '$state', '$uibModal', '$rootScope', 'localStorageService', 'serverAPI', 'Restangular'];
  function almacenesListaController($log, $state, $uibModal, $rootScope, localStorageService, serverAPI, Restangular) {
    $log.log('almacenesListaController');
    var vm = this;
    vm.user = localStorageService.get('user');
    vm.almacenes = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = false;

    vm.productos = [];
    vm.positions = [];
    vm.busqueda = {nombre: ''};
    vm.maxSize = 5;
    vm.itemsPerPage = 10;
    vm.total = 0;
    vm.page = 1;
    vm.hayFerreterias = false;

    vm.goTo = function(id) {
      $state.go('almacenes.item', {id: id});
    };

    vm.goToProductos = function(id) {
      $state.go('categories', {id: id});
    };

    vm.goToVendedores = function(id) {
      $state.go('almacenes_item_vendedores', {id: id})
    };

    vm.remove = function($index, id) {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/almacenes/borrar/borrar.template.html',
        controller: 'almacenesBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('almacenes', id).remove().then(function() {
          vm.almacenes.splice($index, 1);
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.convertAlmacen = function(almacen) {
      var days = JSON.parse(almacen.aHorario).map(function(day, index) {
        day.order = index + 1 === 7 ? 0 : index + 1;
        return day;
      });

      var today = _.findWhere(days, { order: (new Date()).getDay() })
      var beforeTime = moment(today.from, 'HH:mm');
      var afterTime = moment(today.to, 'HH:mm');

      if (!today.enabled) {
        almacen.aHorario = 'Hoy Cerrado';
      } else if (moment().isBetween(beforeTime, afterTime)) {
        almacen.aHorario = 'Abierto: ' + today.from + ' - ' + today.to
      } else {
        almacen.aHorario = 'Cerrado: ' + today.from + ' - ' + today.to
      }

      return almacen;
    }

    vm.buscar = function() {
      vm.isLoading = false;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;

      if (vm.user.privilegio !== 'administrador') {
        var id = (vm.user.propietario || vm.user.vendedor).id;
        Restangular.one('propietarios', id).customGET('almacenes', vm.busqueda).then(function(resp) {
          vm.almacenes = ((resp || {}).almacenes || []).map(vm.convertAlmacen);
          vm.hayFerreterias = vm.almacenes.length > 0;
          vm.isLoading = true;
        });
      } else {
        Restangular.all('almacenes').customGET('', vm.busqueda).then(function(resp) {
          vm.almacenes = (resp.data || []).map(vm.convertAlmacen );

          vm.total = (resp || {}).total || 0;
          vm.page = (resp || {}).current_page || 0;
          vm.hayFerreterias = true;
          vm.isLoading = true;
        })
      }
    };

    vm.buscar();
  }
})();
