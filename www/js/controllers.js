angular.module('starter.controllers', ['ngDialog','moment-picker','ngProgress'])

    .controller('AppCtrl', function($scope,$timeout,ngDialog,$ionicLoading,$ionicBackdrop) {
      var device = device || {};
      var uuid = device.cordova || '1';
      $scope.ref = new Firebase("https://jas.firebaseio.com/easy/"+uuid);
      $scope.easy = new Firebase("https://jas.firebaseio.com/easy/");
      $ionicBackdrop.retain();
      $scope.deviceInfo = {};
      $scope.ref.once('value',function(refSnap){
        $ionicBackdrop.release();
        $scope.deviceInfo = refSnap.val() || {};
        $scope.deviceInfo.key = uuid;
        if(!$scope.deviceInfo.phone){
          $scope.dialog1 = ngDialog.open({
            template: 'templates/phone-modal.html',
            className: 'ngdialog-theme-flat',
            scope: $scope
          });
          $timeout(function(){
            $ionicLoading.hide();
            $("#mobile-number").intlTelInput();
          },1000);
        }
      });
      $scope.continue = function(){
        $scope.ref.child('phone').set({number: $scope.deviceInfo.number, time: Firebase.ServerValue.TIMESTAMP})
        ngDialog.close($scope.dialog1);
        $scope.dialog2 = ngDialog.open({
          template: 'templates/code-modal.html',
          className: 'ngdialog-theme-flat',
          scope: $scope
        });
      };
      $scope.finishCode = function(){
        ngDialog.close($scope.dialog2);
      };
      $scope.next = function(id){
        document.getElementById("input"+id).focus();
      };
      $scope.blur = function(id){
        $timeout(function(){
          document.getElementById("input"+id).blur();
        },100);
      };
    }).directive('selectOnClick', ['$timeout', function($timeout) {
      return {
        restrict: 'AEC',
        link: function(scope, elem, attrs) {
          elem.bind('click', function() {
          });
        }
      }
    }])
    .controller('PlaylistsCtrl', function($scope ,ngDialog,ngProgressFactory,$state, $ionicBackdrop, $ionicLoading, $compile, ionicMaterialInk, ionicMaterialMotion, $ionicModal, $timeout, $state) {
      $scope.dialog1 = {};
      $scope.dialog2 = {};
      $scope.pinImg = true;
      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.setHeight('4px');
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
      };
      $scope.hi = function(){
        //alert(1);
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
        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false,
          duration: 5000
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
      $scope.nowNot = false;
      $scope.notNow = function(){
        /*swal({
         title: "We are sorry",
         text: "This feature will be available soon :)",
         timer: 2000,
         showConfirmButton: false
         });*/
        $scope.nowNot = true;
      }
      function geocodeLatLng(geocoder,latlng) {

        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
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
            $scope.map.setCenter(results[0].geometry.location);
          } else {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
      }
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
            $scope.hideTabs = true;
            $scope.bottomStyle = {bottom: "95px"};
            $timeout(function(){
              $scope.bottomStyle = {bottom: "94px"};
            }, 1000);
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
      $scope.minDate =  moment().format('LLL');
      $scope.currentOrder = {};
      $scope.orderNow = function(){
        $scope.progressbar.start();
        $scope.orderData = {
          time: moment().format('LLL'),
          from: JSON.parse(JSON.stringify($scope.address)),
          to: $scope.toAddress.street ? JSON.parse(JSON.stringify($scope.toAddress)) : JSON.parse(JSON.stringify($scope.address)),
          note: $scope.note.text || {},
          type: ($scope.active-1)
        };
        $scope.modal.hide();
        $ionicBackdrop.retain();
        $scope.pinImg = false;
        $scope.currentOrder = $scope.easy.child('orders').child($scope.deviceInfo.key).push(
            $scope.orderData,
            function(){
              $timeout(function(){
                $scope.progressbar.complete();
                $ionicBackdrop.release();
                $scope.hideTabs = true;
                $scope.bottomStyle = {bottom: "95px"};
                $timeout(function(){
                  $scope.bottomStyle = {bottom: "94px"};
                }, 1000);
                $scope.modal2.show();
              }, 1000);
            }
        );
      }
      $scope.finish = function(){
        $scope.modal2.hide();
        $scope.pinImg = true;
        $state.go('app.finished', {"address": JSON.stringify($scope.address)});

      }
      $scope.code = [];

    })
    .controller('PlaylistCtrl', function($scope, $stateParams) {
    })
    .controller('WelcomeCtrl', function($scope, $stateParams, $state) {
      $scope.user = {};
      $scope.next = function(){
        $state.go('app.playlists');
      };
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
