/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.maps',
    'BlurAdmin.pages.profile',
    'BlurAdmin.pages.productos',
    'BlurAdmin.pages.almacenes',
    'BlurAdmin.pages.propietarios',
    'BlurAdmin.pages.proveedores',
    'BlurAdmin.pages.login',
    'BlurAdmin.pages.users',
    'BlurAdmin.pages.vendedores',
    'BlurAdmin.pages.buscador',
    'BlurAdmin.pages.ventas'
  ])
  .config(appConfig);

  /** @ngInject */
  function appConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/buscador');

    // uiGmapGoogleMapApiProvider.configure({
    //   key: 'AIzaSyAQvTaUFeyoGZ18efkjovF11mxhJWET6xI',
    //   v: '3.20',
    //   libraries: 'weather,geometry,visualization'
    // });
  }

})();
