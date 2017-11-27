(function () {
  'use strict';

  angular.module('BlurAdmin.pages.buscador')
    .controller('buscadorProductDetailController', buscadorProductDetailController);

  buscadorProductDetailController.$inject = ['$log', '$timeout', 'product', 'NgMap'];
  function buscadorProductDetailController($log, timeout, product, NgMap) {
    var vm = this;
    vm.product = product;

    vm.loadMap = function() {
      var reload = function() {
        NgMap.initMap('mapBusqueda');
      };

      timeout(reload, 300);
    };
  }
})();
