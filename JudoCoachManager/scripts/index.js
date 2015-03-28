/// <reference path='app/_all.ts' />
var JudoCoachManager;
(function (JudoCoachManager) {
    "use strict";

    var coachapp = angular.module('coachapp', ['ngRoute', 'ionic', 'elif', 'angular-datepicker']).controller('HomeCtrl', JudoCoachManager.HomeCtrl).config([
        "$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            return new AppInit($stateProvider, $urlRouterProvider);
        }
    ]);

    var AppInit = (function () {
        function AppInit($stateProvider, $urlRouterProvider) {
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
            this.init();
        }
        AppInit.prototype.init = function () {
            this.$stateProvider.state('coachapp', {
                url: "/coachapp",
                abstract: true,
                templateUrl: 'menu.html'
            }).state('coachapp.index', {
                url: "/index",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/index.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/home.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.competition', {
                url: "/competition/:id",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/competition.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.category', {
                url: "/category/:id",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/category.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    },
                    'rightContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.encodeTab', {
                url: "/encodeTab/:id",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/encodeTab.html'
                    },
                    'rightContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.tab', {
                url: "/tab/:id",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/tab.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    },
                    'rightContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.poule', {
                url: "/poule/:id",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/poule.html'
                    },
                    'leftContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            }).state('coachapp.fight', {
                url: "/fight/:id",
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/app/view/fight.html'
                    },
                    'rightContent': {
                        templateUrl: 'scripts/app/view/side/management.html'
                    }
                }
            });
            this.$urlRouterProvider.otherwise('/coachapp/index');
        };
        return AppInit;
    })();
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;

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
    })(Application || (Application = {}));

    window.onload = function () {
        Application.initialize();
    };
})(JudoCoachManager || (JudoCoachManager = {}));
//# sourceMappingURL=index.js.map
