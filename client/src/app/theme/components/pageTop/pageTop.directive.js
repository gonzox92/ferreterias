(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop);

  pageTop.$inject = ['$rootScope', '$state', 'localStorageService'];
  function pageTop($rootScope, $state, localStorageService) {
    var directive = {
      restrict: 'EA',
      link: link,
      templateUrl: 'app/theme/components/pageTop/pageTop.html'
    };

    return directive;

    function link(scope, element, attrs) {
      $rootScope.productos = localStorageService.get('productos') || [];

      scope.logout = function () {
        localStorageService.set('user', null);
        $rootScope.$isLogged = false;
        $state.go('login');

        $rootScope.reloadMenuItems();
      };

      scope.getProfile = function () {
        var user = localStorageService.get('user') || {name: 'Perfil'};
        return user.name;
      };

      scope.market = function () {
        $state.go('venta.registro');
      };
    }
  }

})();
