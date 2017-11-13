(function() {
  'use strict';

  angular.module('BlurAdmin.pages.productos')
    .controller('productosItemCategoriesController', productosItemCategoriesController);

  productosItemCategoriesController.$inject = ['$sce', '$stateParams', 'serverAPI', 'Restangular', 'toastr'];
  function productosItemCategoriesController($sce, $stateParams, serverAPI, Restangular, toastr) {
    var vm = this;
    vm.label = 'sasas';

    vm.messages = [{
      "id": "4563faass",
      "name": "Nasta Linnie",
      "subject": "Great text",
      "date": "2015-08-28T07:57:09",
      "body": $sce.trustAsHtml("<p>Hey John, </p><p>Check out this cool text.</p>"),
      "pic": "img/Nasta.png",
      "email": "petraramsey@mail.com",
      "attachment": "poem.txt",
      "position": "Great Employee",
      "tag": "friend",
      "labels": ['inbox']
    },
      {
        "id": "4563fdfvd",
        "name": "Nasta Linnie",
        "subject": "Lores ipsum",
        "date": "2015-11-19T03:30:45",
        "important": false,
        "body": $sce.trustAsHtml("<p>Hey John, </p><br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ex mauris, ultrices vel lectus quis, scelerisque hendrerit ipsum. Suspendisse ullamcorper turpis neque, eget dapibus magna placerat ac. Suspendisse rhoncus ligula ac mi tempus varius ut sed lacus. Sed et commodo nulla, et placerat leo. Nam rhoncus vulputate sem non pharetra. Praesent fringilla massa in laoreet convallis. Aliquam lobortis dui a congue facilisis. Aenean dapibus semper semper. Quisque aliquam, nibh dapibus interdum condimentum, ex velit tempor tortor, at vestibulum magna leo quis leo. Morbi pulvinar varius erat ac rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In hac habitasse platea dictumst.</p>" +
          "<br><p>Cras rhoncus quam ipsum, vel dignissim nisl egestas sed. Aliquam erat volutpat. Integer eu nisl elit. Donec malesuada diam vitae tellus luctus tincidunt. Donec tempus blandit neque, rutrum egestas ipsum sagittis tempor. Curabitur volutpat ligula enim, nec vehicula purus molestie at. Sed a facilisis enim, nec molestie magna. Donec in augue non est viverra dapibus vel tempus risus. Nam porttitor purus sit amet hendrerit ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>"),
        "pic": "img/Nasta.png",
        "email": "petraramsey@mail.com",
        "position": "Great Employee",
        "tag": "study",
        "labels": ['inbox']
      },
      {
        "id": "4563zxcss",
        "name": "Nasta Linnie",
        "subject": "Lores ipsum",
        "date": "2015-10-19T03:30:45",
        "important": false,
        "body": $sce.trustAsHtml("<p>Hey Nasta, </p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>"),
        "pic": "img/Nasta.png",
        "email": "petraramsey@mail.com",
        "position": "Great Employee",
        "tag": "work",
        "labels": ['sent', 'important']
      },
      {
        "id": "8955sddf",
        "name": "Nick Cat",
        "subject": "New Design",
        "date": "2015-05-05T12:59:45",
        "body": $sce.trustAsHtml("<p>Hey John, Consectetur adipiscing elit</p><br>" +
          "<p>Cras rhoncus quam ipsum, vel dignissim nisl egestas sed. Aliquam erat volutpat. Integer eu nisl elit. Donec malesuada diam vitae tellus luctus tincidunt. Donec tempus blandit neque, rutrum egestas ipsum sagittis tempor. Curabitur volutpat ligula enim, nec vehicula purus molestie at. Sed a facilisis enim, nec molestie magna. Donec in augue non est viverra dapibus vel tempus risus. Nam porttitor purus sit amet hendrerit ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>"),
        "pic": "img/Nick.png",
        "email": "barlowshort@mail.com",
        "position": "Graphical designer",
        "attachment": "design.psd",
        "tag": "work",
        "labels": ['inbox']
      }]
  }
})();
