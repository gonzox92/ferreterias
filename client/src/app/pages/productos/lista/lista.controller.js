(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosListaController', productosListaController);

  productosListaController.$inject = ['$log', '$state', '$stateParams', '$timeout',
    '$uibModal', '$rootScope', 'serverAPI', 'Restangular', 'localStorageService'];
  function productosListaController($log, $state, $stateParams, $timeout, $uibModal, $rootScope,
                                    serverAPI, Restangular, localStorageService) {
    $log.log('productosListaController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.productos = [];
    vm.busqueda = {nombre: ''};
    vm.categoryList = [];

    vm.goTo = function(id) {
      $state.go('productos_item.detail', {id: $stateParams.id, idProducto: id});
    };

    vm.goToProducts = function(node) {
      $state.go('categories_productos', {id: $stateParams.id, idCategoria: node.id});
    };

    vm.addNewCategory = function(isCategory, parent) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/nueva-categoria/nueva-categoria.template.html',
        controller: 'nuevaCategoriaController',
        controllerAs: 'vm',
        resolve: {
          isCategory: function() {
            return isCategory;
          },
          parent: function() {
            return parent;
          },
          entity: function() {
            return null;
          }
        }
      });
  
      modalInstance.result.then(function (selectedItem) {
        location.reload(true);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.editCategory = function(isCategory, parent, node) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/nueva-categoria/nueva-categoria.template.html',
        controller: 'nuevaCategoriaController',
        controllerAs: 'vm',
        resolve: {
          isCategory: function() {
            return isCategory;
          },
          parent: function() {
            return parent;
          },
          entity: function() {
            return node;
          }
        }
      });
  
      modalInstance.result.then(function (editedItem) {
        var indexItem = _.findIndex(vm.categories, {id: editedItem.id});

        if (indexItem >= 0) {
          _.extend(vm.categories[indexItem], editedItem);
          vm.loadGrid(vm.categories);
        }
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.deleteCategory = function(isCategory, node) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/productos/borrar/borrar.template.html',
        controller: 'productosBorrarController',
        controllerAs: 'vm',
        resolve: {
          entity: function() {
            return {
              title: isCategory ? 'Categoria' : 'Sub-Categoria',
              name: node.cNombre
            }
          }
        }
      });
  
      modalInstance.result.then(function () {
        Restangular.one(isCategory ? 'categorias' : 'subcategorias', node.id).remove().then(function() {
          location.reload(true);
        });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.loadGrid = function(categories, isFromFilter) {
      vm.categoryList = categories
        .filter(function(category) {
          return !category.ParentId;
        }).map(function(category) {
          category.subcategories = categories.filter(function(subcategory) {
            return subcategory.ParentId === category.id;
          });
          return category;
        });

      if (isFromFilter) {
        vm.categoryList = vm.categoryList.filter(function(category) {
          return (category.subcategories || []).length > 0;
        });

        $timeout(function() {
          vm.grid.masonry('destroy');
          vm.grid = $('.category-list').masonry({
            itemSelector: '.category-item',
          });
          // vm.grid.masonry('reloadItems');
        }, 200);
      };
    };

    vm.load = function() {
      vm.isLoading = true;
      Restangular.one('almacenes', $stateParams.id).customGET('categorias').then(function(data) {
        vm.categories = data || [];
        vm.isLoading = false;
        vm.loadGrid(vm.categories);

        $timeout(function() {
          vm.grid = $('.category-list').masonry({
            itemSelector: '.category-item',
          });
        }, 200);
      }, function() {
        vm.isLoading = false;
      });
    };

    vm.buscar = function() {
      var filteredCategories = vm.categories.filter(function(category) {
        vm.busqueda.nombre = vm.busqueda.nombre || '';

        return !category.ParentId || category.cNombre.toLowerCase().indexOf(vm.busqueda.nombre.toLowerCase()) >= 0;
      });

      vm.loadGrid(filteredCategories, true);
    };

    vm.load();
  }
})();
