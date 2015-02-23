// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
module JudoCoachManager {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

    }

    window.onload = function () {
        Application.initialize();
    }
}

var app = angular.module('judoapp', ['ngRoute', 'ionic', 'elif', 'angular-datepicker']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: 'menu.html'
        })
        .state('app.index', {
            url: "/index",
            views: {
                'menuContent': {
                    templateUrl: 'partials/index.html'
                }
            }
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: 'partials/home.html'
                },
                'leftContent': {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.competition', {
            url: "/competition/:id",
            views: {
                'menuContent': {
                    templateUrl: 'partials/competition.html'
                },
                'leftContent': {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.category', {
            url: "/category/:id",
            views: {
                'menuContent': {
                    templateUrl: 'partials/category.html'
                },
                'leftContent': {
                    templateUrl: 'partials/side/management.html'
                },
                'rightContent': {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.encodeTab', {
            url: "/encodeTab/:id",
            views: {
                'menuContent': {
                    templateUrl: 'partials/encodeTab.html'
                },
                'rightContent': {
                    templateUrl: 'partials/side/management.html'
                },
                'leftContent': {
                    templateUrl: 'partials/side/management.html'
                }

            }
        })
        .state('app.tab', {
            url: "/tab/:id",
            views: {
                'menuContent': {
                    templateUrl: 'partials/tab.html'
                },
                'leftContent': {
                    templateUrl: 'partials/side/management.html'
                },
                'rightContent': {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.poule', {
            url: "/poule/:id",
            views: {
                'menuContent': {
                    templateUrl: 'partials/poule.html'
                },
                'leftContent': {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.fight', {
            url: "/fight/:id",
            views: {
                'menuContent': {
                    templateUrl: 'partials/fight.html'
                },
                'rightContent': {
                    templateUrl: 'partials/side/management.html'
                }
            }
        });
    $urlRouterProvider.otherwise('/app/index');
