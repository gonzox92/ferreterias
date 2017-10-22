(function() {
  angular
    .module('BlurAdmin.pages.dashboard')
    .controller('dashboardProductosController', dashboardProductosController);

  dashboardProductosController.$inject = [
    '$element',
    'baConfig',
    'layoutPaths',
    'Restangular'
  ];

  function dashboardProductosController($element, baConfig, layoutPaths, Restangular) {
    var vm = this;

    vm.isLoading = true;
    vm.haveResults = false;
    vm.format = 'yyyy-MM-dd';
    vm.productos = [];
    vm.options = {
      showWeeks: false
    };

    vm.open = function(control) {
      vm[control + 'Opened'] = true;
    };

    vm.generateReport = function() {
      var layoutColors = baConfig.colors;
      var id = 'pieChart';

      vm.haveResults = false;
      vm.isLoading = false;

      var startDate = vm.startDate ? moment(vm.startDate).format('YYYY-MM-DD') : null;
      var endDate = vm.endDate ? moment(vm.endDate).format('YYYY-MM-DD') : null;

      Restangular.one('busquedas').customGET('', { from: startDate, to: endDate }).then(function(results) {
        vm.isLoading = true;
        vm.productos = results || [];
        vm.haveResults = vm.productos.length > 0;

        var pieChart = AmCharts.makeChart(id, {
          type: 'pie',
          startDuration: 0,
          theme: 'blur',
          addClassNames: true,
          color: layoutColors.defaultText,
          labelTickColor: layoutColors.borderDark,
          legend: {
            position: 'right',
            marginRight: 100,
            autoMargins: false,
          },
          innerRadius: '40%',
          defs: {
            filter: [
              {
                id: 'shadow',
                width: '200%',
                height: '200%',
                feOffset: {
                  result: 'offOut',
                  in: 'SourceAlpha',
                  dx: 0,
                  dy: 0
                },
                feGaussianBlur: {
                  result: 'blurOut',
                  in: 'offOut',
                  stdDeviation: 5
                },
                feBlend: {
                  in: 'SourceGraphic',
                  in2: 'blurOut',
                  mode: 'normal'
                }
              }
            ]
          },
          dataProvider: (results || []).slice(0, 10),
          valueField: 'contador',
          titleField: 'palabra',
          export: {
            enabled: true
          },
          creditsPosition: 'bottom-left',
    
          autoMargins: false,
          marginTop: 10,
          alpha: 0.8,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          pullOutRadius: 0,
          pathToImages: layoutPaths.images.amChart,
          responsive: {
            enabled: true,
            rules: [
              // at 900px wide, we hide legend
              {
                maxWidth: 900,
                overrides: {
                  legend: {
                    enabled: false
                  }
                }
              },
    
              // at 200 px we hide value axis labels altogether
              {
                maxWidth: 200,
                overrides: {
                  valueAxes: {
                    labelsEnabled: false
                  },
                  marginTop: 30,
                  marginBottom: 30,
                  marginLeft: 30,
                  marginRight: 30
                }
              }
            ]
          }
        });
    
        pieChart.addListener('init', handleInit);
    
        pieChart.addListener('rollOverSlice', function (e) {
          handleRollOver(e);
        });
    
        function handleInit() {
          pieChart.legend.addListener('rollOverItem', handleRollOver);
        }
    
        function handleRollOver(e) {
          var wedge = e.dataItem.wedge.node;
          wedge.parentNode.appendChild(wedge);
        }
      });
    };
  }
})();
