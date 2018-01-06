(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('dashboardUsuariosController', dashboardUsuariosController);

  dashboardUsuariosController.$inject = ['$timeout', 'Restangular'];
  function dashboardUsuariosController($timeout, Restangular) {
    var vm = this;
    var startMonth = moment().startOf('month');
    var endMonth = moment().endOf('month');
  
    vm.displayReport1 = false;
    vm.displayReport2 = false;
    vm.isLoading = false;
    vm.fromDate = new Date();
    vm.toDate = new Date();

    vm.loadReport = function() {
      vm.isLoading1 = true;
      vm.isLoading2 = true;

      $timeout(vm.loadAccessReport, 600);
      $timeout(vm.loadConcurrenceReport, 720);
    };

    vm.loadConcurrenceReport = function() {
      vm.isLoading2 = false;
      vm.displayReport2 = true;

      var config = {
        type: 'line',
        data: {
          labels: ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'],
          datasets: [{
            label: 'Administrador',
            data: [10, 12, 8, 6, 9, 14, 7],
            fill: false,
            borderColor: '#209e91',
            backgroundColor: '#209e91',
          }, {
            label: 'Propietarios',
            data: [2, 5, 8, 12, 6, 7, 8],
            fill: false,
            borderColor: '#f0ad4e',
            backgroundColor: '#f0ad4e',
          }, {
            label: 'Vendedores',
            data: [12, 8, 24, 7, 13, 5, 1],
            fill: false,
            borderColor: '#E85654',
            backgroundColor: '#E85654',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title:{
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Horarios'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Usuarios'
              }
            }]
          },
          legend: {
            display: true
          }
        }
      };

      $timeout(function() {
        var ctx = document.getElementById('reportConcurrence').getContext('2d');
        window.concurrence = new Chart(ctx, config);
      }, 100);
    };

    vm.loadAccessReport = function() {
      vm.isLoading1 = false;
      vm.displayReport1 = true;
      
      var config = {
        type: 'radar',
        data: {
          labels: ['Administrador', 'Propietarios', 'Vendedores'],
          datasets: [{
            data: [45, 23, 56],
            fill: true,
            backgroundColor: 'rgba(32,158,145, 0.6)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title:{
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: false,
              scaleLabel: {
                display: true,
                labelString: 'Fecha'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Ingresos'
              }
            }]
          }
        }
      };

      $timeout(function() {
        var ctx = document.getElementById('reportAccess').getContext('2d');
        window.myLine = new Chart(ctx, config);
      }, 100);
    };

    vm.loadReport();
  }
})();
