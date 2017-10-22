(function () {
  'use strict';

  angular.module('BlurAdmin.api')
    .service('serverAPI', serverAPI);

  /** @ngInject */
  serverAPI.$inject = ['Restangular'];
  function serverAPI(Restangular) {
    var service = {
      productos: Restangular.service('productos'),
      almacenes: Restangular.service('almacenes'),
      cantidades: Restangular.service('cantidades'),
      propietarios: Restangular.service('propietarios')
    };

    return service;
  }

})();
