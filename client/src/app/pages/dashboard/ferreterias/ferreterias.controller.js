(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('dashboardFerreteriasController', dashboardFerreteriasController);

  dashboardFerreteriasController.$inject = ['$timeout', 'Restangular'];
  function dashboardFerreteriasController($timeout, Restangular) {
    var vm = this;
    var startMonth = moment().startOf('month');
    var endMonth = moment().endOf('month');

    vm.displayReport = false;
    vm.isLoading = false;
    vm.fromDate = new Date(+startMonth.format('YYYY'), +startMonth.format('MM') - 1, +startMonth.format('DD'));
    vm.toDate = new Date(+endMonth.format('YYYY'), +endMonth.format('MM') - 1, +endMonth.format('DD'));
    vm.format = 'dd-MM-yyyy';
    vm.options = {
      showWeeks: false
    };

    vm.load = function() {
      vm.isLoading = true;
      vm.displayReport = false;

      var busqueda = {
        from: moment(vm.fromDate).format('YYYY-MM-DD'),
        to: moment(vm.toDate).format('YYYY-MM-DD')
      };

      Restangular.all('almacenes_fecha').customGET('', busqueda).then(function(resp) {
        if (!_.isEmpty(resp)) {
          vm.isLoading = false;
          vm.displayReport = true;
          vm.loadReport(resp);
        } else {
          vm.isLoading = false;
          vm.displayReport = false;
        }
      });
    };

    vm.loadReport = function(dates) {
      var labels = dates.map(function(date) {
        return moment(date.fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');
      });

      var data = dates.map(function(date) {
        return date.registros;
      });

      var config = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Fechas de Registro',
            data: data,
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
                labelString: 'Fecha'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Registros'
              }
            }]
          }
        }
      };


      $timeout(function() {
        var ctx = document.getElementById('report').getContext('2d');
        window.myLine = new Chart(ctx, config);
      }, 100);
    };

    vm.load();
  }

})();
