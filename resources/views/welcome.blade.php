<!DOCTYPE html>
<html lang="en" ng-app="BlurAdmin">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ferreteria</title>

  <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900&subset=latin,greek,greek-ext,vietnamese,cyrillic-ext,latin-ext,cyrillic' rel='stylesheet' type='text/css'>

  <link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="assets/img/favicon-96x96.png">

  <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQvTaUFeyoGZ18efkjovF11mxhJWET6xI&callback=initMap" type="text/javascript"></script>

  <link rel="stylesheet" href="styles/vendor-e21197619a.css">

  <link rel="stylesheet" href="styles/app-a0bb84b567.css">


  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css">
  <style>
    .spinner>div {
      width: 2px !important;
      margin: 0 1px !important;
    }

    body.mobile .body-bg {
      position: inherit !important;
    }
  </style>

</head>
<body>
<div class="body-bg"></div>

<main ng-if="$pageFinishedLoading" class="main-container" ng-class="{ 'menu-collapsed': $baSidebarService.isMenuCollapsed() }">

  <ba-sidebar></ba-sidebar>
  <page-top></page-top>

  <div class="al-main">
    <div class="al-content">

      <div class="updating-content" ng-show="$pageIsUpdating">
        <div class="sk-circle">
          <div class="sk-circle1 sk-child"></div>
          <div class="sk-circle2 sk-child"></div>
          <div class="sk-circle3 sk-child"></div>
          <div class="sk-circle4 sk-child"></div>
          <div class="sk-circle5 sk-child"></div>
          <div class="sk-circle6 sk-child"></div>
          <div class="sk-circle7 sk-child"></div>
          <div class="sk-circle8 sk-child"></div>
          <div class="sk-circle9 sk-child"></div>
          <div class="sk-circle10 sk-child"></div>
          <div class="sk-circle11 sk-child"></div>
          <div class="sk-circle12 sk-child"></div>
        </div>

        Actualizando ...
      </div>

      <content-top></content-top>
      <div ui-view autoscroll="true" autoscroll-body-top class="al-container"></div>
    </div>
  </div>

  <back-top></back-top>
</main>

<div id="preloader" ng-show="!$pageFinishedLoading">
  <div></div>
</div>

<script src="scripts/vendor-e1d6a1ab6c.js"></script>

<script src="scripts/app-abadb4317f.js"></script>

<script src="https://rawgit.com/allenhwkim/angularjs-google-maps/master/build/scripts/ng-map.js"></script>
<script src="assets/js/slick.min.js"></script>
<script src="assets/js/js-shortid.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.1/masonry.pkgd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.8.0/JsBarcode.all.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.6.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCLBRpgkwzs4NZnb7Pr-_8kLAB7Y5J8eXY",
    authDomain: "ferreterias-cdb93.firebaseapp.com",
    databaseURL: "https://ferreterias-cdb93.firebaseio.com",
    projectId: "ferreterias-cdb93",
    storageBucket: "ferreterias-cdb93.appspot.com",
    messagingSenderId: "202728785580"
  };
  firebase.initializeApp(config);
</script>
</body>
</html>
