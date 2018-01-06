(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('almacenesItemController', almacenesItemController);

  almacenesItemController.$inject = ['$log', '$scope', '$state', '$stateParams', '$uibModal', '$rootScope', '$timeout',
                                    'Restangular', 'serverAPI', 'toastr', 'localStorageService'];
  function almacenesItemController($log, $scope, $state, $stateParams, $uibModal, $rootScope, $timeout, 
                                  Restangular, serverAPI, toastr, localStorageService) {
    $log.log('almacenesItemController');
    var vm = this;
    vm.progress = 10;
    vm.almacen = {};
    vm.propietarios = [];
    vm.user = localStorageService.get('user');
    vm.isValidSchedule = true;

    $scope.$on('mapInitialized', function(evt, evtMap) {
      vm.map = evtMap;
    });

    vm.days = [{
      title: 'Lunes', from: '09:00', to: '18:00', enabled: false
    }, {
      title: 'Martes', from: '09:00', to: '18:00', enabled: false
    }, {
      title: 'Miercoles', from: '09:00', to: '18:00', enabled: false
    }, {
      title: 'Jueves', from: '09:00', to: '18:00', enabled: false
    }, {
      title: 'Viernes', from: '09:00', to: '18:00', enabled: false
    }, {
      title: 'Sabado', from: '09:00', to: '18:00', enabled: false
    }, {
      title: 'Domingo', from: '09:00', to: '18:00', enabled: false
    }];

    vm.times = (function() {
      var startHour = moment('12:00 AM', 'hh:mm A');
      var endHour = moment('11:59 PM', 'hh:mm A');
      var hours = [];

      while (startHour < endHour) {
        hours.push(startHour.format('HH:mm'));
        startHour.add(15, 'minutes');
      }

      return hours;
    })();

    $timeout(function() {
      $('.mini-time').autocomplete({
        source: vm.times,
        minLength: 0
      }).on('focus', function() { $(this).keydown(); });
    }, 500);

    vm.remove = function() {
      var deleteMessage = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/almacenes/borrar/borrar.template.html',
        controller: 'almacenesBorrarController',
        controllerAs: 'vm',
        resolve: {}
      });

      deleteMessage.result.then(function() {
        Restangular.one('almacenes', vm.almacen.id).remove().then(function() {
          $state.go('almacenes.listar');
        });
      }, function() {
        $log.log('Borrar fue cancelado')
      });
    };

    vm.submit = function() {
      var currentPosition = vm.map.markers[0].getPosition();
      vm.almacen.aUbicacion = '[' + currentPosition.lat() + ',' + currentPosition.lng() + ']';
      vm.almacen.aHorario = JSON.stringify(vm.days.map(function(day) {
        return {title: day.title, from: day.from, to: day.to, enabled: day.enabled};
      }));

      Restangular.one('almacenes', vm.almacen.id).customPUT(vm.almacen).then(function(resp) {
        $rootScope.$pageIsUpdating = false;
        toastr.success('Datos actualizados correctamente', 'Actualizado');
        $state.go('almacenes.listar');
      }, function() {
        toastr.error('Error actualizando Ferreteria');
        $rootScope.$pageIsUpdating = false;
      });
    };

    vm.upload = function(isValid) {
      if (!isValid) {
        return;
      }

      vm.isValidSchedule = true;
      vm.days.forEach(function(day) {
        if (vm.isValidSchedule) {
          vm.isValidSchedule = moment(day.from, 'HH:mm', true).isValid() &&
            moment(day.to, 'HH:mm', true).isValid();
        } 
      });

      if (!vm.isValidSchedule) {
        return;
      }

      $rootScope.$pageIsUpdating = true;

      if (_.isObject(vm.file) && !vm.file.$error) {
        var timestamp = Number(new Date());
        var storageRef = firebase.storage().ref(timestamp.toString());
        var uploadTask = storageRef.put(vm.file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
            vm.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + vm.progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            $log.error(error.code);
          }, function() {
            vm.almacen.aImagen = uploadTask.snapshot.downloadURL;
            vm.submit();
          });
      } else {
        vm.submit();
      }
    };

    serverAPI.almacenes.get($stateParams.id).then(function(resp) {
      vm.almacen = {
        id: resp.id,
        aNombre: resp.aNombre || '',
        aImagen: resp.aImagen || '/assets/pictures/empty.png',
        aDireccion: resp.aDireccion || '',
        aUbicacion: resp.aUbicacion || '[-17.387015, -66.162159]',
        aHorario: resp.aHorario,
        idPropietario: resp.idPropietario
      };

      _.extend(vm.days, JSON.parse(resp.aHorario));
    });

    Restangular.all('propietarios').getList().then(function(resp) {
      vm.propietarios = (resp || []);
    });
  }
})();
