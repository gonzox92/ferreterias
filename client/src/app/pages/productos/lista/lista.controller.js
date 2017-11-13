(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosListaController', productosListaController);

  productosListaController.$inject = ['$log', '$state', '$stateParams', '$TreeDnDConvert', '$timeout',
    '$uibModal', '$rootScope', 'serverAPI', 'Restangular', 'localStorageService'];
  function productosListaController($log, $state, $stateParams, $TreeDnDConvert, $timeout, $uibModal, $rootScope,
                                    serverAPI, Restangular, localStorageService) {
    $log.log('productosListaController');
    var vm = this;
    vm.user = localStorageService.get('user') || {};
    vm.productos = [];
    vm.busqueda = {nombre: ''};
    vm.isLoading = true;
    console.log(vm.user)
    vm.goTo = function(id) {
      $state.go('productos_item.detail', {id: $stateParams.id, idProducto: id});
    };

    var tree;
    vm.tree_data = {};
    vm.my_tree = tree = {};
    vm._filter = {};

    vm.my_tree.goToProducts = function(node) {
      $state.go('categories_productos', {id: $stateParams.id, idCategoria: node.id});
    };

    vm.expanding_property = {
      /*template: "<td>OK All</td>",*/
      field: 'cNombre',
      titleClass: 'text-center',
      cellClass: 'v-middle',
      displayName: 'Nombre'
    };
    vm.col_defs = [{
      displayName: 'Productos',
      cellTemplate: '<button ng-if="node.ParentId" ng-click="tree.goToProducts(node)" class="btn btn-default btn-sm">Productos</button>'   
    },{
      displayName: 'Borrar',
      cellTemplate: '<button ng-click="tree.remove_node(node)" class="btn btn-default btn-sm">Borrar</button>'
    }];

    vm.tree_data = [];

    Restangular.one('almacenes', $stateParams.id).customGET('categorias').then(function(data) {
      vm.tree_data = $TreeDnDConvert.line2tree(data || [], 'id', 'ParentId');
      vm.isLoading = false;
    }, function() {
      vm.isLoading = false;
    });

    // vm.tree_list = $TreeDnDConvert.line2tree(vm.tree_data, 'id', 'ParentId');    
  }
})();
