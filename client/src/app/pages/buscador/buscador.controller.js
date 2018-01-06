(function () {
  'use strict';

  angular.module('BlurAdmin.pages.buscador')
    .controller('buscadorController', buscadorController);

  buscadorController.$inject = ['Restangular', '$rootScope', '$state', '$uibModal', 'localStorageService', 'ngDialog', 'NgMap'];
  function buscadorController(Restangular, $rootScope, $state, $uibModal, localStorageService, ngDialog, NgMap) {
    var vm = this;
    vm.user = localStorageService.get('user');
    console.log(vm.user)
    vm.groups = [];
    vm.ferreterias = [];
    vm.busqueda = {nombre: '', useFerreterias: 'own', nearToMe: false};
    vm.maxSize = 10;
    vm.itemsPerPage = 500;
    vm.total = 0;
    vm.page = 1;
    vm.noResults = false;
    vm.results = false;
    vm.isLoading = false;
    vm.isMapMode = true;
    vm.isListMode = false;
    vm.firstSearch = true;
    vm.visibleFilter = false;
    vm.isLoaded = false;
    vm.withGeolocation = 'geolocation' in navigator;

    NgMap.getMap({id:'search_map'}).then(function(map) {
      vm.map = map;
    });

    vm.changeMode = function() {
      vm.isMapMode = !vm.isMapMode;
      vm.isListMode = !vm.isListMode;
      vm.map.hideInfoWindow('foo-iw');
    };

    vm.responsive = [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ];

    vm.buscar = function() {
      if (!vm.busqueda.nombre) {
        return;
      }

      if (vm.firstSearch) {
        vm.firstSearch = false;
        vm.isListMode = true;
        vm.isMapMode = false;
      }

      vm.isLoaded = false;
      vm.isLoading = true;
      vm.busqueda.page = vm.page;
      vm.busqueda.limit = vm.itemsPerPage;
      vm.groups = [];

      if (vm.user && vm.user.privilegio !== 'administrador') {
        vm.busqueda.privilegio = vm.user.privilegio;
        vm.busqueda.ownerID = (vm.user['propietario'] || vm.user['vendedor']).id;
      }

      Restangular.one('productos').get(vm.busqueda).then(function(resp) {
        vm.groups = {};
        vm.isLoaded = true;
        vm.ferreterias = ((resp || {}).data || {}).ferreterias || [];
        vm.markers = vm.ferreterias.filter(function(ferreteria) {
          return ferreteria.aUbicacion;
        });

        var products = _.toArray(_.filter((resp || {}).data || {}, function(data, index) {
          return _.isNumber(+index);
        }));

        vm.results = products.length > 0;
        vm.total = (resp || {}).total || 0;
        vm.page = (resp || {}).current_page || 0;
        vm.noResults = vm.total === 0;

        products.forEach(function(product) {
          if (product.scNombre && !vm.groups[product.scNombre]) {
            var subProducts = products.filter(function(element) {
              return element.scNombre === product.scNombre;
            });

            var filteredProducts = {};
            subProducts.forEach(function(element) {
              if (filteredProducts[element.pNombre]) {
                filteredProducts[element.pNombre].ferreterias = filteredProducts[element.pNombre].ferreterias || [];

                if (element.aUbicacion) {
                  filteredProducts[element.pNombre].ferreterias.push(element.aUbicacion);
                }
              } else {
                filteredProducts[element.pNombre] = {
                  pNombre: element.pNombre,
                  pImagen: element.pImagen,
                  UPC: element.UPC,
                  scNombre: element.scNombre,
                  ferreterias: [],
                  minDistance: Infinity
                }
              }
            });

            filteredProducts = _.toArray(filteredProducts);

            vm.groups[product.scNombre] = {
              UPC: product.UPC,
              scNombre: product.scNombre,
              products: filteredProducts || [],
              qty: filteredProducts.length,
              isExpanded: true
            };
          }
        });

        vm.groups = _.toArray(vm.groups);
        
        // Order by geolocation
        if (vm.busqueda.nearToMe && vm.withGeolocation) {
          var calculateDistanceProducts = function(position) {
            vm.groups.forEach(function(group, indexGroup) {
              group.products.forEach(function(product, indexProduct) {
                product.ferreterias.forEach(function(ferreteria, indexFerreteria) {
                  var point = ferreteria.substr(1).slice(0, -1).split(',')
                  var lat = +point[0];
                  var log = +point[1];

                  var distance = vm.getDistance(lat, log, position.coords.latitude, position.coords.longitude);
                  var minDistance = vm.groups[indexGroup].products[indexProduct].minDistance;
                  vm.groups[indexGroup].products[indexProduct].minDistance = Math.min(minDistance, distance);
                });
              });
            });
          };

          var currentPosition = localStorageService.get('current-position');
          var lastUpdatePosition = moment(localStorageService.get('last-update-position'), 'MM/DD/YYYY HH:mm');
          var currentTime = moment(new Date(), 'MM/DD/YYYY HH:mm');
          var timeToUpdate = 2;

          if (!_.isEmpty(currentPosition) && lastUpdatePosition.isValid() && currentTime.diff(lastUpdatePosition, 'minutes') < timeToUpdate) {
            calculateDistanceProducts(currentPosition);
            vm.isLoading = false;
          } else {
            navigator.geolocation.getCurrentPosition(function(position) {
              localStorageService.set('current-position', {
                coords: {latitude: position.coords.latitude, longitude: position.coords.longitude}
              });
              localStorageService.set('last-update-position', moment().format('MM/DD/YYYY HH:mm'));

              var currentPosition = localStorageService.get('currentPosition');
  
              calculateDistanceProducts(position);
              console.log('SHOULD RENDER')
              vm.isLoading = false;
            }, function() {
              console.error('Error utilizando geolocalizacion para busqueda');
              vm.isLoading = false;
            }); 
          }
        } else {
          vm.isLoading = false;
        }

      }, function() {
        vm.isLoaded = true;
        vm.isLoading = false;
        vm.results = true;
      });
    };

    vm.showFerreteriaInMap = function($ev, ferreteria) {
      if (!ferreteria.aUbicacion) {
        vm.map.hideInfoWindow('foo-iw');
        return;
      }

      var newCenter = ferreteria.aUbicacion.substr(1).slice(0, -1).split(',')
      var latLng = new google.maps.LatLng(+newCenter[0], +newCenter[1]); 

      vm.ferreteria = ferreteria;
      vm.map.panTo(latLng);
      vm.map.showInfoWindow('foo-iw', "marker-" + ferreteria.id);
    };

    vm.showFilters = function() {
      vm.visibleFilter = !vm.visibleFilter;
      $('.optional-filter')[vm.visibleFilter ? 'removeClass' : 'addClass']('responsive');
    };

    vm.openProductDetail = function(item) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/buscador/product-detail/product-detail.template.html',
        controller: 'buscadorProductDetailController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          item: function() {
            return item;
          },
          currentPosition: function() {
            return localStorageService.get('current-position') || {};
          },
          orderByDistance: function() {
            return vm.busqueda.nearToMe;
          },
          useFerreterias: function() {
            return vm.busqueda.useFerreterias;
          }
        }
      });
  
      modalInstance.result.then(function() {
        
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
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
    }
    
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    vm.getSuggestions = function(val) {
      var busqueda = {
        nombre: val,
        limit: 5
      };
      
      return Restangular.one('upc').get(busqueda).then(function(resp) {
        var data = (resp || {}).data || [];

        var names = data.map(function(entity) {
          return entity.nombre;
        });
        console.log(names)
        return names;
      });
    };
  }
})();
