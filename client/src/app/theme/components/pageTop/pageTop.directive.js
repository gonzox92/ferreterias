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

      scope.user = localStorageService.get('user') || {};
      scope.profileImage = scope.user.imagen || '/assets/img/app/profile/empty-profile.png';

      scope.logout = function () {
        localStorageService.set('user', null);
        $rootScope.$isLogged = false;
        $state.go('login');

        $rootScope.reloadMenuItems();
        $rootScope.updateProfileImage();
      };

      scope.market = function () {
        $state.go('venta.registro');
      };

      $rootScope.updateProfileImage = function(image) {
        scope.profileImage = image || '/assets/img/app/profile/empty-profile.png';
      };
      
      $rootScope.updateProfileName = function(name) {
        scope.user.name = name;
      }
    }
  }

})();
