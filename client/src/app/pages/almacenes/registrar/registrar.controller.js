(function() {
  'use strict';

  angular.module('BlurAdmin.pages.almacenes')
    .controller('almacenesRegistroController', almacenesRegistroController);

  almacenesRegistroController.$inject = ['$log', '$state', '$rootScope', '$scope', '$timeout', 
    'localStorageService', 'serverAPI', 'Restangular', 'Upload'];
  function almacenesRegistroController($log, $state, $rootScope, $scope, $timeout,
    localStorageService, serverAPI, Restangular, Upload) {
    
    $log.log('productosRegistroController');
    var vm = this;
    vm.user = localStorageService.get('user');
    vm.progress = 10;
    vm.isValidSchedule = true;
    vm.propietarios = [];
    vm.almacen = {
      idPropietario: 0,
      aNombre: '',
      aImagen: '/assets/pictures/empty.png',
      aDireccion: '',
      aUbicacion: '',
      aHorario: '',
      aEntrega: 'recoge'
    };

    vm.days = [{
      title: 'Lunes', from: '09:00', to: '18:00', enabled: true
    }, {
      title: 'Martes', from: '09:00', to: '18:00', enabled: true
    }, {
      title: 'Miercoles', from: '09:00', to: '18:00', enabled: true
    }, {
      title: 'Jueves', from: '09:00', to: '18:00', enabled: true
    }, {
      title: 'Viernes', from: '09:00', to: '18:00', enabled: true
    }, {
      title: 'Sabado', from: '09:00', to: '18:00', enabled: true
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

    $scope.$on('mapInitialized', function(evt, evtMap) {
      vm.map = evtMap;
    });

    vm.submit = function() {
      var currentPosition = vm.map.markers[0].getPosition();
      vm.almacen.aHorario = JSON.stringify(vm.days.map(function(day) {
        return {title: day.title, from: day.from, to: day.to, enabled: day.enabled};
      }));
      vm.almacen.aUbicacion = '[' + currentPosition.lat() + ',' + currentPosition.lng() + ']';
      vm.almacen.idPropietario = vm.user.privilegio !== 'administrador' ?
        vm.user.propietario.id : vm.almacen.idPropietario;

      serverAPI.almacenes.post(vm.almacen).then(function(resp) {
        $state.go('almacenes.listar');
        $rootScope.$pageIsUpdating = false;
      }, function() {
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

    Restangular.all('propietarios').getList().then(function(resp) {
      vm.propietarios = (resp || []);
    });
  }
})();
