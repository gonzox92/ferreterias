(function () {
  'use strict';

  angular.module('BlurAdmin.pages.buscador')
    .controller('buscadorController', buscadorController);

  buscadorController.$inject = ['Restangular', '$rootScope', '$state', 'localStorageService', 'ngDialog'];
  function buscadorController(Restangular, $rootScope, $state, localStorageService, ngDialog) {
    var vm = this;
    vm.user = localStorageService.get('user') || {};

    vm.productos = [];
    vm.positions = [];
    vm.busqueda = {palabras: ''};
    vm.maxSize = 5;
    vm.itemsPerPage = 10;
    vm.total = 0;
    vm.page = 1;
    vm.hayListaProductos = false;
    vm.isLoading = true;

    vm.buscar = function() {
      var busqueda = _.clone(vm.busqueda);
      busqueda.nombre = vm.busqueda.palabras.replace(/,/g, '').split(' ').join(',');
      busqueda.page = vm.page;
      busqueda.limit = vm.itemsPerPage;
      busqueda.isAutocomplete  = false;
      vm.isLoading = false;

      if (vm.user.privilegio === 'propietario') {
        busqueda.idPropietario = vm.user.propietario.id;
      }
      if (vm.user.privilegio === 'vendedor') {
        busqueda.idVendedor = vm.user.vendedor.id;
      }

      Restangular.one('productos').get(busqueda).then(function (resp) {
        vm.productos = ((resp || {}).data || []).map(function(item) {
          item.pImagen = item.pImagen.indexOf('http://') >= 0 || item.pImagen.indexOf('https://') >= 0 ?
            item.pImagen : $rootScope.baseURL + 'api/fileentry/get/' + item.pImagen;
          return item;
        });
        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;

        vm.positions = _.uniq(vm.productos, function(producto) {
          return producto.aUbicacion;
        })
        vm.positions = vm.positions
          .map(function(producto) {
            return {
              id: producto.idAlmacen,
              nombre: producto.aNombre,
              direccion: producto.aDireccion,
              ubicacion: producto.aUbicacion,
              imagen: producto.aImagen
            };
          })
          .filter(function (almacen) {
            return almacen.ubicacion !== '[0,0]';
          });

        vm.hayListaProductos = vm.productos.length > 0;
        vm.isLoading = true;
        $('.panel.with-scroll .panel-body').addClass('results');
      });
    };

    vm.getAutocomplete = function(val) {
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

    vm.goToFerreteria = function(idFerreteria) {
      $state.go('almacenes.item', {id: idFerreteria})
    };

    vm.openMap = function() {
      ngDialog.open({
        templateUrl: 'app/pages/buscador/mapa/mapa.template.html',
        className: 'ngdialog-theme-default',
        controller: 'MapaBusquedaController',
        controllerAs: 'vm',
        resolve: {
          positions: function() {
            return vm.positions || [];
          },
          productos: function() {
            return vm.productos || [];
          }
        }
      });
    }
  }
})();
