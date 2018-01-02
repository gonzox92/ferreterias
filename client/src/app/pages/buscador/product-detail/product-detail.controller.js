(function () {
  'use strict';

  angular.module('BlurAdmin.pages.buscador')
    .controller('buscadorProductDetailController', buscadorProductDetailController);

  buscadorProductDetailController.$inject = ['$log', '$timeout', '$uibModal', '$uibModalInstance', 'Restangular', 'localStorageService',
    'item', 'currentPosition', 'orderByDistance', 'useFerreterias'];
  function buscadorProductDetailController($log, $timeout, $uibModal, $uibModalInstance, Restangular, localStorageService,
    item, currentPosition, orderByDistance, useFerreterias) {
    var vm = this;
    
    vm.user = localStorageService.get('user');
    vm.item = item;
    vm.showCode = false;
    vm.isLoading = false;
    vm.products = [];
    vm.busqueda = {upc: item.UPC};
    vm.maxSize = 5;
    vm.itemsPerPage = 15;
    vm.total = 0;
    vm.page = 1;
    vm.hayProductos = false;

    $timeout(function() {
      JsBarcode('#barcode', vm.item.UPC);
    }, 100);

    vm.showCodeItems = function() {
      vm.showCode = !vm.showCode;

      var operation = vm.showCode ? 'removeClass' : 'addClass';
      $('.code-item')[operation]('visible-md visible-lg');
    };

    vm.buscar = function() {
      vm.isLoading = true;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;

      if (vm.user && vm.user.privilegio !== 'administrador') {
        vm.busqueda.useFerreterias = useFerreterias;
        vm.busqueda.privilegio = vm.user.privilegio;
        vm.busqueda.ownerID = (vm.user['propietario'] || vm.user['vendedor']).id;
      }

      Restangular.all('productos_lista').customGET('', vm.busqueda).then(function(resp) {
        vm.products = (resp || {}).data || [];

        vm.adJustProducts();

        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;
        vm.hayProductos = vm.products.length > 0;
        vm.isLoading = false;
      }, function() {
        vm.isLoading = false;
      });
    };

    vm.openItemInfo = function(item) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/buscador/product-detail/product-detail-info.template.html',
        controller: 'buscadorProductDetailInfoController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          item: function() {
            return item;
          }
        }
      });
  
      modalInstance.result.then(function() {
        
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.closeDialog = function() {
      $uibModalInstance.dismiss();
    };

    vm.getDistance = function(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = deg2rad(lon2 - lon1); 
      var a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
      var d = R * c * 1000; // Distance in m
      
      return d;
    };
    
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    };

    vm.adJustProducts = function() {
      var currentPosition = localStorageService.get('current-position');
      var lastUpdatePosition = moment(localStorageService.get('last-update-position'), 'MM/DD/YYYY HH:mm');
      var currentTime = moment(new Date(), 'MM/DD/YYYY HH:mm');
      var timeToUpdate = 5;

      var updateProductWithDistance = function(position) {
        vm.products.forEach(function(product, index) {
          if (product.aUbicacion) {
            var point = product.aUbicacion.substr(1).slice(0, -1).split(',')
            var lat = +point[0];
            var log = +point[1];

            var distance = +vm.getDistance(lat, log, position.coords.latitude, position.coords.longitude).toFixed(2);
            var labelDistance = distance > 500 ? (distance / 1000).toFixed(2) + ' Km' : distance + ' m';
            
            vm.products[index].showDistance = true;
            vm.products[index].distance = distance;
            vm.products[index].labelDistance = labelDistance;            
          } else {
            vm.products[index].distance = Infinity;
          }
        });

        if (orderByDistance) {
          vm.products = _.sortBy(vm.products, function(product) {
            return product.distance;
          });
        }
      };

      if (!_.isEmpty(currentPosition) && lastUpdatePosition.isValid(), currentTime.diff(lastUpdatePosition, 'minutes') < timeToUpdate) {
        updateProductWithDistance(currentPosition);
      } else {
        navigator.geolocation.getCurrentPosition(function(position) {
          updateProductWithDistance(position);
        }, function() {
          console.error('Error utilizando geolocalizacion para busqueda');
        }); 
      }
    };

    vm.buscar();
  }
})();
