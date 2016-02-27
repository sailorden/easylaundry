angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

}).directive('selectOnClick', ['$timeout', function($timeout) {
      return {
        restrict: 'AEC',
        link: function(scope, elem, attrs) {
            console.log(elem);
            elem.bind('click', function() {
              console.log(elem);
            });
        }
      }
    }])
  .controller('PlaylistsCtrl', function($scope, $ionicLoading, $compile, ionicMaterialInk, ionicMaterialMotion, $ionicModal, $timeout) {
    $scope.active = 1;
    $scope.plan = [
      {title: "Laundry",
        pricing: "~20 ₪ (5 USD)",
      description: "You will get your clothes clean fast, with nice smell and wet"},
      {title: "Dry Laundry",
        pricing: "~30 ₪  (8 USD)",
        description: "You will get your clothes clean with nice smell, dry and folded."},
      {title: "Ironed Laundry",
        pricing: "~50 ₪  (12 USD)",
        description: "You will get your clothes clean with nice smell, ironed and folded."}
    ]

    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
    function initialize() {
      var myLatlng = new google.maps.LatLng(32.0729785,34.7744848);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

      //Marker + infowindow + angularjs compiled ng-click
      var geocoder = new google.maps.Geocoder;
      /*var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
      });*/
      map.addListener('idle', function() {
        var pos = map.getCenter();
        //marker.setPosition(pos);
        console.log(pos);
        geocodeLatLng(geocoder, pos);
      });
      $scope.loading = false;
      map.addListener('dragstart', function() {
        $scope.loading = true;
      });
      $scope.map = map;
      $scope.centerOnMe();
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    $scope.editingAddress = false;
    $scope.editAddress = function(val){
      $scope.editingAddress = val;
    }
    $scope.descriptionPlan = false;
    $scope.descriptionText = false;
    $scope.changeTab = function(which){
      if(which != $scope.active){
        $timeout(function(){
          $scope.descriptionPlan = true;
          $scope.descriptionText = true;
          $timeout(function(){
            $scope.descriptionText = false;
          }, 9995);
          $timeout(function(){
            $scope.descriptionPlan = false;
          }, 10000);
        },1);
      }
    }
    $scope.editToAddress = function(val){
      $scope.editingToAddress = val;
      $scope.inputStyle = {};
      if(val)
      $scope.inputStyle = {'height': '10px'};
    }
    $scope.note = {};
    $scope.isEditing = false;
    $scope.editNote = function(val){
      $scope.isEditing = val;
    }
    $scope.centerOnMe = function() {
      if(!$scope.map) {
        return;
      }
      $scope.aguantaa = function(){
        console.log("jaslai");
      }
      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.map.setZoom(16);
        $scope.loading.hide();
      }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };
    $scope.address = {};
    $scope.toAddress = {};
    $scope.notNow = function(){
      swal({
        title: "We are sorry",
        text: "This feature will be available soon :)",
        timer: 2000,
        showConfirmButton: false
      });
    }
    function geocodeLatLng(geocoder,latlng) {
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          $timeout(function(){
            $scope.loading = false;
            $scope.address = {
                street: results[0].formatted_address.split(',')[0],
                neighborhood: results[0].formatted_address.split(',')[1],
                geolocation: latlng
            }

          })
        }
      });
    }
    $scope.orderData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/order.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeOrder = function() {
      $scope.hideTabs = false;
      $scope.modal.hide();
    };
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      $scope.hideTabs = false;
    });
    // Open the login modal

    $scope.hideTabs = false;
    $scope.changeAddress = function(){
      $scope.toAddress.street = $scope.address.street;
    }
      $scope.whenTime = false;
      $scope.fromTime = false;
      $scope.toTime = false;
    $scope.order = function() {
      swal({
        title: "",
        text: "Do you want the "+$scope.plan[$scope.active].title+"?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#55c9a1",
        confirmButtonText: "Yes!",
        cancelButtonText:"Oh, no",
        closeOnConfirm: false,
        closeOnCancel: false,
        allowOutsideClick: true
      }, function(isConfirm) {
        if(isConfirm){
          $scope.address.picture = "https://maps.googleapis.com/maps/api/staticmap?center="+$scope.address.geolocation+"&zoom=18&size=300x300&maptype=roadmap";
          $scope.address.picture+="&markers=icon:http://i60.tinypic.com/2j2bvgx.png|"+$scope.address.geolocation+"&key=AIzaSyB_NUmb6TXFR6CpHOlkMpSipswTA_K6FiI";
          $scope.hideTabs = true;
          $scope.modal.show();
          $timeout(function(){
            $scope.whenTime = true;
            $timeout(function(){
              $scope.fromTime = true;
              $timeout(function(){
                $scope.toTime = true;
              }, 1666);
            }, 1666);
          }, 1666);
        }else{

        }
        swal({
          title: "Choose your desired laundry",
          customClass: 'popupLaundry',
          text: "<img class='select-on-click selectOnClick' src='img/laundry2.png'><img select-on-click src='img/hanger.png'><img select-on-click src='img/complete4.png'><br><span>Simple</span><span>Dry</span><span>Ironed</span>",
          html: true,
          showConfirmButton: false
      });
      });

    };
  })
.controller('PlaylistCtrl', function($scope, $stateParams) {
});
