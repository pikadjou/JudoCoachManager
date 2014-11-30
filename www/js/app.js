// Attendre que PhoneGap soit prêt
//
document.addEventListener("deviceready", onDeviceReady, false);
// PhoneGap est prêt
//
function onDeviceReady() {
    $db = window.openDatabase("Database", "1.0", "JudoCoachManager", 200000);
    $db.transaction(populateDB, errorCB, successCB);
}
// Alimentation de la base de données
//
function populateDB(tx) {

//    tx.executeSql('DROP TABLE IF EXISTS COMPETITIONS');
    tx.executeSql('CREATE TABLE IF NOT EXISTS COMPETITIONS (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, created DATE);');
   
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
function errorCB(tx, err) {
    console.log("Erreur de traitement SQL (Init) : "+err);
    console.log(err);
    return false;
}
// Fonction de callback en cas de réussite de la transaction
//
function successCB() {
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
onDeviceReady();
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
                'menuContent' : {
                    templateUrl: 'partials/index.html'
                }
            }
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/home.html'
                },
                'leftContent' : {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.competition', {
            url: "/competition/:id",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/competition.html'
                },
                'leftContent' : {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.category', {
            url: "/category/:id",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/category.html'
                },
                'leftContent' : {
                    templateUrl: 'partials/side/management.html'
                },
                'rightContent' : {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.encodeTab', {
            url: "/encodeTab/:id",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/encodeTab.html'
                },
                'rightContent' : {
                    templateUrl: 'partials/side/management.html'
                },
                'leftContent' : {
                    templateUrl: 'partials/side/management.html'
                }
                
            }
        })
        .state('app.tab', {
            url: "/tab/:id",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/tab.html'
                },
                'leftContent' : {
                    templateUrl: 'partials/side/management.html'
                },
                'rightContent' : {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.poule', {
            url: "/poule/:id",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/poule.html'
                },
                'leftContent' : {
                    templateUrl: 'partials/side/management.html'
                }
            }
        })
        .state('app.fight', {
            url: "/fight/:id",
            views: {
                'menuContent' : {
                    templateUrl: 'partials/fight.html'
                },
                'rightContent' : {
                    templateUrl: 'partials/side/management.html'
                }
            }
        });
        $urlRouterProvider.otherwise('/app/index');
});
