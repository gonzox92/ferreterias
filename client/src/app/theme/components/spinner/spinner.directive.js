
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('spinner', spinner);

  spinner.$inject = [];
  function spinner() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/spinner/spinner.template.html',
      link:function($scope, element, attrs) {
      }
    }
  }
})();
