(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('dashboardResultadosController', dashboardResultadosController);

  dashboardResultadosController.$inject = ['$timeout', 'Restangular'];
  function dashboardResultadosController($timeout, Restangular) {
    var vm = this;
    var startMonth = moment().startOf('month');
    var endMonth = moment().endOf('month');
  
    vm.displayReport1 = false;
    vm.displayReport2 = false;
    vm.displayReport3 = false;

    vm.fromDate = new Date();
    vm.toDate = new Date();

    vm.topFerreterias = [{
      name: 'Ferreteria J & E',
      qty: 3252
    }, {
      name: 'Ferreteria Julio Saravia Caceres',
      qty: 2965
    }, {
      name: 'Ferreteria "el Mesias"',
      qty: 3289
    }, {
      name: 'Ferreteria "leo Hurtado"',
      qty: 3262
    }, {
      name: 'Ferreteria Maged ',
      qty: 3186
    }, {
      name: 'Ferreteria Plomer',
      qty: 3142
    }, {
      name: 'Expo Ferreteria S.r.l.',
      qty: 3418
    }, {
      name: 'Ferreteria Alba',
      qty: 3042
    }, {
      name: 'Ferreteria Columbus',
      qty: 3102
    }, {
      name: 'Ferreteria Dylan',
      qty: 3118
    }, {
      name: 'Ferreteria Viloco',
      qty: 3154
    }, {
      name: 'Ferreteria Yanpartikuy',
      qty: 3014
    }];

    vm.loadReport = function() {
      vm.isLoading1 = true;
      vm.isLoading2 = true;
      vm.isLoading3 = true;

      $timeout(vm.loadReportTop, 600);
      $timeout(vm.loadReportCantidad, 720);
      $timeout(vm.loadReportVisitas, 420);
    };

    vm.loadReportTop = function() {
      vm.isLoading1 = false;
      vm.displayReport1 = true;

      var config = {
        type: 'line',
        data: {
          labels: ['Ferreteria J & E', 'Ferreteria Julio Saravia Caceres', 'Ferreteria "el Mesias"', 'Ferreteria "leo Hurtado"',
                    'Ferreteria Maged', 'Ferreteria Plomer', 'Expo Ferreteria S.r.l.', 'Ferreteria Alba', 'Ferreteria Columbus',
                    'Ferreteria Dylan', 'Ferreteria Viloco', 'Ferreteria Yanpartikuy'],
          datasets: [{
            data: [65, 45, 62, 40, 32, 12, 7, 34, 51, 54, 21, 18],
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
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Ferreterias'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Visitas'
              }
            }]
          },
          legend: {
            display: false
          }
        }
      };

      $timeout(function() {
        var ctx = document.getElementById('reportTop').getContext('2d');
        window.top = new Chart(ctx, config);
      }, 100);
    };

    vm.loadReportCantidad = function() {
      vm.isLoading2 = false;
      vm.displayReport2 = true;
    };

    vm.loadReportVisitas = function() {
      vm.isLoading3 = false;
      vm.displayReport3 = true;

      var config = {
        type: 'doughnut',
        data: {
          labels: ['Administrador', 'Propietarios', 'Vendedores', 'Sin Registrar'],
          datasets: [{
            data: [23, 102, 52, 87],
            fill: true,
            backgroundColor: ['#209e91', '#f0ad4e', '#E85654']
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
                labelString: 'Ferreterias'
              }
            }],
            yAxes: [{
              display: false,
              scaleLabel: {
                display: true,
                labelString: 'Visitas'
              }
            }]
          },
          legend: {
            display: true
          }
        }
      };

      $timeout(function() {
        var ctx = document.getElementById('reportVisitas').getContext('2d');
        window.top = new Chart(ctx, config);
      }, 100);
    };

    vm.loadReport();
  }
})();
