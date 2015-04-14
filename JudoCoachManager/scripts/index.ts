/// <reference path='app/_all.ts' />

module JudoCoachManager {
    "use strict";
	var db: Database = null;
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
                    templateUrl: 'menu.html'
                })
                .state('coachapp.index', {
                    url: "/index",
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/app/view/index.html'
                        },
                        'leftContent': {
                            templateUrl: 'scripts/app/view/side/management.html'
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
			onDeviceReady();
        }

        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
			db = window.openDatabase("Database", "1.0", "JudoCoachManager", 200000);
			db.transaction(populateDB, errorCB, successCB);
        }

		// Alimentation de la base de données
		//
		function populateDB(tx) {

			//    tx.executeSql('DROP TABLE IF EXISTS COMPETITIONS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS COMPETITIONS (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, created TEXT);');

			//   tx.executeSql('DROP TABLE IF EXISTS CATEGORIES_COMPETITIONS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIES_COMPETITIONS (id INTEGER PRIMARY KEY AUTOINCREMENT, competition_id INTEGER, category_id INTEGER, number INTEGER);');

			//    tx.executeSql('DROP TABLE IF EXISTS JUDOKAS_COMPETITIONS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS JUDOKAS_COMPETITIONS (id INTEGER PRIMARY KEY AUTOINCREMENT, category_competition_id INTEGER, judoka_id INTEGER, place INTEGER, number INTEGER, fights INTEGER, mine INTEGER, weigh TEXT);');

			//    tx.executeSql('DROP TABLE IF EXISTS FIGHTS');
			tx.executeSql("CREATE TABLE IF NOT EXISTS FIGHTS (id INTEGER PRIMARY KEY AUTOINCREMENT, category_competition_id INTEGER, type INTEGER, number INTEGER, white_id INTEGER, blue_id INTEGER, score_white INTEGER, score_blue INTEGER, winner INTEGER);");

			//   tx.executeSql('DROP TABLE IF EXISTS JUDOKAS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS JUDOKAS (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, club TEXT, mine INTEGER);');

			//    tx.executeSql('DROP TABLE IF EXISTS CATEGORIES');
			tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIES (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);');

		}
		// Fonction de callback en cas d'échec de la transaction
		//
		function errorCB(err) {
			console.log("Erreur de traitement SQL (Init) : " + err);
			console.log(err);
		}
		// Fonction de callback en cas de réussite de la transaction
		//
		function successCB() {
			console.log("cool ma poule");
			db.transaction(function (tx) {
				var d = new Date();
				tx.executeSql("INSERT INTO COMPETITIONS(name,created) values('test1','')");
            });
			//    $db.transaction(function(tx){
			//        tx.executeSql("SELECT * FROM COMPETITIONS JOIN CATEGORIES;",[],
			//            function(tx, results){
			//                var data = [];
			//                for (var i=0; i<results.rows.length; i++){
			//                    data[i] = results.rows.item(i);
			//                }
			//                console.log(data);
			//            }, function (tx, err) { alert("Erreur de traitement SQL : "+err.message); },
			//            function (tx, err) { alert("Erreur de traitement SQL : "+err.message); }
			//        );
			//    });
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