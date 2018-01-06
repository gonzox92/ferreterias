(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard', [])
      .config(routeConfig);

  /** @ngInject */
  routeConfig.$inject = ['$stateProvider', 'baConfigProvider'];
  function routeConfig($stateProvider, baConfigProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/reportes',
        template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        title: 'Reportes',
        abstract: true,
        sidebarMeta: {
          icon: 'ion-stats-bars',
          order: 100,
          visible: true,
          privileges: ['administrador', 'propietario']
        },
      })
      .state('dashboard.ferreterias', {
        url: '/ferreterias',
        templateUrl: 'app/pages/dashboard/ferreterias/ferreterias.template.html',
        controller: 'dashboardFerreteriasController',
        controllerAs: 'vm',
        title: 'Registro',
        sidebarMeta: {
          order: 10,
          visible: true,
          isChild: true
        },
      })
      .state('dashboard.usuarios', {
        url: '/usuarios',
        templateUrl: 'app/pages/dashboard/usuarios/usuarios.template.html',
        controller: 'dashboardUsuariosController',
        controllerAs: 'vm',
        title: 'Usuarios',
        sidebarMeta: {
          order: 20,
          visible: true,
          isChild: true
        },
      })
      .state('dashboard.summary', {
        url: '/ferreterias/resultados',
        templateUrl: 'app/pages/dashboard/resultados/resultados.template.html',
        controller: 'dashboardResultadosController',
        controllerAs: 'vm',
        title: 'Ferreterias',
        sidebarMeta: {
          order: 30,
          visible: true,
          isChild: true
        },
      })
      .state('dashboard.productos', {
        url: '/productos',
        templateUrl: 'app/pages/dashboard/productos/productos.template.html',
        controller: 'dashboardProductosController',
        controllerAs: 'vm',
        title: 'Productos',
        sidebarMeta: {
          order: 40,
          visible: true,
          isChild: true
        },
      })
  }
})();
