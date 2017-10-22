angular
  .module('BlurAdmin.pages.buscador')
  .controller('MapaBusquedaController', MapaBusquedaController);

MapaBusquedaController.$inject = [
  '$rootScope',
  '$state',
  '$timeout',
  'ngDialog',
  'NgMap',
  'positions',
  'productos'
];

function MapaBusquedaController($rootScope, $state, $timeout, ngDialog, NgMap, almacenes, productos) {
  var vm = this;
  vm.almacenes = almacenes;
  vm.productos = productos;

  vm.almacenes = vm.almacenes.map(function(almacen) {
    almacen.imagen = almacen.imagen.indexOf('http://') >= 0 || almacen.imagen.indexOf('https://') >= 0 ?
      almacen.imagen : $rootScope.baseURL + 'api/fileentry/get/' + almacen.imagen;
    return almacen;
  })

  vm.initializeMap = function(map) {
    vm.map = map;
    
    _.each((map || {}).markers || [], function(marker, index) {
      marker.addListener('click', vm.openFerreteria(index, marker));
    });
  };

  vm.goToFerreteria = function(idFerreteria) {
    $state.go('almacenes.item', {id: idFerreteria})
  };
  
  window.closeMap = function() {
    ngDialog.closeAll();
  };

  vm.openFerreteria = function(index, marker) {
    return function() {
      var almacen = vm.almacenes[index];
      var infoWindow = new google.maps.InfoWindow({
        content: [
          '<div class="item-producto-mapa">',
            '<img class="imagen-producto" src="', almacen.imagen,'">',
            '<div class="descripcion">',
              '<h2>', almacen.nombre, '<h2>',
              '<p>', almacen.direccion, '</p>',
            '</div>',
          '</div>',
          '<a href="/#/almacenes/', almacen.id ,'" onclick="closeMap()">',
            '<i class="fa fa-industry"></i>Ir a Ferreteria',
          '</a>',
        ].join('')
      });

      infoWindow.open(vm.map, marker);
    };
  };

  $timeout(function() {
    NgMap.initMap('mapBusqueda');
  }, 300);
}
