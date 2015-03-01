/// <reference path='app/_all.ts' />

module JudoCoachManager {
    "use strict";

    var coachapp = angular.module('coachapp', ['ngRoute', 'ionic', 'elif', 'angular-datepicker'])
        .controller('HomeCtrl', HomeCtrl)
        .config(
        ["$stateProvider", "$urlRouterProvider",
            ($stateProvider, $urlRouterProvider) => {
                return new AppInit($stateProvider, $urlRouterProvider);
            }
        ]);

    class AppInit {

        constructor(private $stateProvider: ng.ui.IStateProvider, private $urlRouterProvider: ng.ui.IUrlRouterProvider)
        {
            this.init();
        }
        private init(): void {
            this.$stateProvider
                .state('coachapp', {
                    url: "/coachapp",
                    abstract: true,
                    templateUrl: 'scripts/app/view/home.html'
                })
                .state('coachapp.index', {
                    url: "/index",
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/app/view/index.html'
                        }
                    }
                })
                .state('coachapp.home', {
                    url: "/home",
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/app/view/home.html'
                        },
                        'leftContent': {
                            templateUrl: 'scripts/app/view/side/management.html'
                        }
                    }
                })
                .state('coachapp.competition', {
                    url: "/competition/:id",
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/app/view/competition.html'
                        },
                        'leftContent': {
                            templateUrl: 'scripts/app/view/side/management.html'
                        }
                    }
                })
                .state('coachapp.category', {
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
                })
                .state('coachapp.encodeTab', {
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
                })
                .state('coachapp.tab', {
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
                })
                .state('coachapp.poule', {
                    url: "/poule/:id",
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/app/view/poule.html'
                        },
                        'leftContent': {
                            templateUrl: 'scripts/app/view/side/management.html'
                        }
                    }
                })
                .state('coachapp.fight', {
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
        }
       
    }
    module Application {
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