// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            showClose: false,
            closeByEscape: false,
            closeByNavigation: false,
            closeByDocument: false,
        });
    }])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.welcome', {
                url: '/welcome',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'WelcomeCtrl'
                    }
                }
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })

            .state('app.finished', {
                url: '/finished/:address',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/finished.html',
                        controller: 'BrowseCtrl'
                    }
                }
            })
            .state('app.playlists', {
                url: '/playlists',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlists.html',
                        controller: 'PlaylistsCtrl'
                    }
                }
            })
            .state('app.single', {
                url: '/playlists/:playlistId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
    }).directive('focusMe', function($timeout) {
        return {
            link: function(scope, element, attrs) {
                scope.$watch(attrs.focusMe, function(value) {
                    if(value === true) {
                        console.log('value=',value);
                        //$timeout(function() {
                        element[0].focus();
                        scope[attrs.focusMe] = false;
                        //});
                    }
                });
            }
        };
    }).directive('numericOnly', function() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9|+| ]/g, '');
                    if(transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;  // or return Number(transformedInput)
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });