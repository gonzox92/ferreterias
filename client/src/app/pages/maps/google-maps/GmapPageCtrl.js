/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.maps')
      .controller('GmapPageCtrl', GmapPageCtrl);

  GmapPageCtrl.$inject = ['$timeout', '$state', 'NgMap', 'Restangular', 'localStorageService'];
  function GmapPageCtrl($timeout, $state, NgMap, Restangular, localStorageService) {
    var vm = this;
    vm.productos = [];
    vm.user = localStorageService.get('user');
    vm.positions = [];

    vm.nombre = '';
    vm.descripcion = '';
    vm.precio = '0';
    vm.currentSymbol = '>';
    vm.symbols = ['>', '<', '>=', '<=', '='];

    vm.maxSize = 5;
    vm.itemsPerPage = 6;
    vm.total = 0;
    vm.page = 1;

    NgMap.getMap({ id: 'mapBusqueda' }).then(function(map) {
      google.maps.event.trigger(map, "resize");
      vm.map = map;
    });

    vm.displayMap = function () {
      vm.showMap = true;
    };

    vm.find = function () {
      var busqueda = {
        nombre: vm.nombre,
        descripcion: vm.descripcion,
        valor1: vm.currentSymbol + '|' + vm.precio,

        page: vm.page,
        limit: vm.itemsPerPage
      };

      var privilegio = vm.user.propietario || vm.user.vendedor;

      Restangular.one('propietarios', privilegio.id).customGET('productos', busqueda).then(function (resp) {
        vm.productos = (resp || {}).data || [];
        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;

        vm.positions = vm.productos.map(function (producto) {
          return {
            nombre: producto.aNombre,
            pos: producto.aUbicacion
          }
        });
      });
    };

    vm.pageChanged = function () {
      vm.find();
    };

    vm.getProductos = function (val) {
      var busqueda = {
        nombre: val,
        limit: 12
      };

      return Restangular.one('productos').get(busqueda).then(function (resp) {
        return (resp || []).map(function (producto) {
          return producto.pNombre;
        });
      });
    };

    vm.goToFerreteria = function (idAlmacen) {
      $state.go('almacenes.item', {id: idAlmacen});
    };
  }
})();
