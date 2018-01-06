
(function () {
  'use strict';

  angular.module('BlurAdmin.api', ['restangular'])
    .config(apiConfig);

  apiConfig.$inject = ['RestangularProvider'];
  function apiConfig(RestangularProvider) {
    // RestangularProvider.setBaseUrl('http://localhost:8000/api');
    RestangularProvider.setBaseUrl(window.location.origin + '/api');
  }

})();
