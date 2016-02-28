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
    .controller('PlaylistsCtrl', function($scope, $ionicBackdrop, $ionicLoading, $compile, ionicMaterialInk, ionicMaterialMotion, $ionicModal, $timeout, $state) {
      $scope.pinImg = true;
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
      var geocoder = new google.maps.Geocoder;
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
        if(!val){
          $scope.addressManual(geocoder, $scope.address.street + "," +$scope.address.full_address);
        }
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
          $ionicLoading.hide();
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
            console.log(results[0]);
            $timeout(function(){
              var full_address = "";
              for(var i =2; i<results[0].address_components.length; i++){
                full_address +=results[0].address_components[i].long_name + ", ";
              }
              full_address = full_address.substr(0,full_address.length-2);
              $scope.loading = false;
              $scope.address = {
                street: results[0].formatted_address.split(',')[0],
                neighborhood: results[0].formatted_address.split(',')[1],
                full_address: full_address,
                geolocation: latlng
              }

            })
          }
        });
      }
      $scope.addressManual = function(geocoder, address){
        console.log(address);
        $scope.loading = true;
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
            var full_address = "";
            for(var i =2; i<results[0].address_components.length; i++){
              full_address +=results[0].address_components[i].long_name + ", ";
            }
            full_address = full_address.substr(0,full_address.length-2);
            $scope.loading = false;
            $scope.address = {
              street: results[0].formatted_address.split(',')[0],
              neighborhood: results[0].formatted_address.split(',')[1],
              full_address: full_address,
              geolocation: results[0].geometry.location
            }
            console.log(results[0].geometry.location);
            $scope.map.setCenter(results[0].geometry.location);
          } else {
            alert("Geocode was not successful for the following reason: " + status);
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

      $ionicModal.fromTemplateUrl('templates/washers.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal2 = modal;
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
          closeOnConfirm: true,
          closeOnCancel: true,
          allowOutsideClick: true
        }, function(isConfirm) {
          if(isConfirm){
            $scope.address.picture = "https://maps.googleapis.com/maps/api/staticmap?center="+$scope.address.geolocation+"&zoom=18&size=640x640&maptype=roadmap";
            $scope.address.picture+="&markers=icon:http://i.imgur.com/v2OTGza.png?2|"+$scope.address.geolocation+"&key=AIzaSyB_NUmb6TXFR6CpHOlkMpSipswTA_K6FiI";
            console.log($scope.address);
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
          /*swal({
           title: "Choose your desired laundry",
           customClass: 'popupLaundry',
           text: "<img class='select-on-click selectOnClick' src='img/laundry2.png'><img select-on-click src='img/hanger.png'><img select-on-click src='img/complete4.png'><br><span>Simple</span><span>Dry</span><span>Ironed</span>",
           html: true,
           showConfirmButton: false
           });*/
        });

      };
      $scope.orderNow = function(){
        $scope.modal.hide();
        $ionicBackdrop.retain();
        $scope.pinImg = false;
        $timeout(function(){
          $ionicBackdrop.release();
          $scope.hideTabs = true;
          $scope.modal2.show();
        });
      }
      $scope.finish = function(){
        $scope.modal2.hide();
        $scope.pinImg = true;
        $state.go('app.finished', {"address": JSON.stringify($scope.address)});
      }
    })
    .controller('PlaylistCtrl', function($scope, $stateParams) {
    })
    .controller('BrowseCtrl', function($scope, $stateParams,$ionicModal, $state) {
      $scope.info = JSON.parse($stateParams.address);
      $ionicModal.fromTemplateUrl('templates/rate.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.rate = function(){
        $scope.modal.show();
      }
      $scope.rating = function(id){
        $scope.doneRating = id;
      }
      $scope.send = function(){
        $scope.modal.hide();
      }
      $scope.newOrder = function(){
        $state.go('app.playlists');
      }
      $scope.cancelation = function(){
        swal({
          title: "Pay attention",
          text: "The washer is on his way! We will contact them. Do you want to cancel it?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: false
        }, function() {
          swal({
            title: "Cancelled",
            text: "We are happy if you are happy",
            type: "success",
            closeOnConfirm: true
          }, function() {
            $state.go('app.playlists');
          });
        });
      }
    });
