(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('dashboardProductosController', dashboardProductosController);

  dashboardProductosController.$inject = ['$timeout', 'Restangular'];
  function dashboardProductosController($timeout, Restangular) {
    var vm = this;
    var startMonth = moment().startOf('month');
    var endMonth = moment().endOf('month');

    vm.topProductos = [
      'Alicates para instaladores Knipex',
      'Alicates de titanio',
      'Tenazas pico de loro',
      'Puntas de atornillar',
      'Cutters detectables desechables',
      'Destornilladores planos',
      'Botas de protección Husqvarna',
      'Cuerda trencilla en polipropileno',
      'LEDs ultravioleta Philips',
      'Linternas 3AA Propolymer Haz-Lo',
      'Gafas de protección láser Univet 562',
      'Equipo portaherramientas',
      'Escaleras de aluminio KTL Advanced',
      'Siliconas en spray Soudal',
      'Adhesivo instantáneo UHU',
      'Colas para PVC Soudal PVC',
      'Tuberías y accesorios en PRFV Aiqsa'
    ];

    vm.topProveedores = [{
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-238800.gif',
      name: 'Industrias Peygran, S.L.',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-080326.gif',
      name: 'Agencia Internacional de Comercio, S.L. - Aginco',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-189567.gif',
      name: 'Unifersa 2006, S.A. - CLICKFER',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-809819.gif',
      name: 'Proandamio',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-001310.gif',
      name: 'Recanvis Agrícoles Albareda, S.L',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-003429.gif',
      name: 'Makita, S.A.',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-192402.gif',
      name: 'Incale, S.L.',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-205217.gif',
      name: 'Pasema, S.A.',
    }, {
      image: 'http://www.interempresas.net/FeriaVirtual/banners/B-177361.gif',
      name: 'Fein Power Tools Ibérica, S.L.U.',
    }];

    vm.topCategorias = [{
      name: 'Brocas de metal duro',
      qty: 23
    }, {
      name: 'Linternas',
      qty: 12
    }, {
      name: 'Discos ranuradores',
      qty: 45
    }, {
      name: 'Esmaltes',
      qty: 65
    }, {
      name: 'Tuberías y accesorios de acero',
      qty: 23
    }, {
      name: 'Gafas de protección',
      qty: 9
    }, {
      name: 'Varios ferretería',
      qty: 86
    }]

    var labels = vm.topCategorias.map(function(category) {
      return category.name;
    });
    var data = vm.topCategorias.map(function(category) {
      return category.qty;
    });

    vm.loadReport = function() {
      vm.isLoading1 = true;
      vm.isLoading2 = true;
      vm.isLoading3 = true;

      $timeout(vm.loadTopProductos, 600);
      $timeout(vm.loadTopCategorias, 720);
      $timeout(vm.loadTopProveedores, 420);
    };

    vm.loadTopProductos = function() {
      vm.isLoading1 = false;
      vm.displayReport1 = true;
    };

    vm.loadTopCategorias = function() {
      vm.isLoading2 = false;
      vm.displayReport2 = true;

      var config = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
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
                labelString: 'Categorias'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Productos'
              }
            }]
          },
          legend: {
            display: false
          }
        }
      };

      $timeout(function() {
        var ctx = document.getElementById('reportCategorias').getContext('2d');
        window.top = new Chart(ctx, config);
      }, 100);
    };
    
    vm.loadTopProveedores = function() {
      vm.isLoading3 = false;
      vm.displayReport3 = true;
    };

    vm.loadReport();
  }
})();
