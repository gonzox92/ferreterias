/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  ProfilePageCtrl.$inject = ['$scope', 'fileReader', '$filter', '$uibModal', 'localStorageService'];
  function ProfilePageCtrl($scope, fileReader, $filter, $uibModal, localStorageService) {
    var vm = this;

    vm.user = localStorageService.get('user');
    vm.password2 = vm.user.password;
  }
})();
