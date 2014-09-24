app.controller('HomeCtrl', function ($scope, $location, Competition){
    $scope.list = Competition.find().then(function(data){
         $scope.list = data;
    }, function(msg){ alert(msg); });
    
    $scope.encode = function(name){
        var data = {
            "id": 0,
            "name": name
        }
        Competition.addOne(data).then(function(data){
            $location.path('/competition/'+data.insertId);
        }, function(msg){ alert(msg); });
    }
});

app.controller('CompetitionCtrl', function ($scope, $stateParams, Category, CategoryCompetition){
    $idCompetiton = $stateParams.id;
    
    $scope.category = "";
    $scope.categoriesList = [];
    Category.find().then(function(data){
        $scope.categoriesList = data;
    }, function(msg){ alert(msg); });
    
    CategoryCompetition.findCategories($idCompetiton).then(function(data){
        $scope.categoriesPresent = data;
    }, function(msg){ alert(msg); });
    
    $scope.encodeCategory = function(name){
        Category.getByName(name, true).then(function(id){
            CategoryCompetition.addCategory($idCompetiton, id).then(function(data){
                $scope.categoriesPresent = data;
            }, function(msg){ alert(msg); });
        }, function(msg){ alert(msg) });
    }
});

app.controller('CategoryCtrl', function ($scope, $stateParams, Judoka, JudokaCompetition, CategoryCompetition){
    $id = $stateParams.id;
      
     $scope.detail = false;
     
    JudokaCompetition.findEncode($id).then(function(data){
        $scope.judokaEncode = data;
    }, function(msg){ alert(msg); });
    
    $scope.judokaMine = [];
    Judoka.findMine().then(function(data){
        $scope.judokaMine = data;
    }, function(msg){ alert(msg); });

    $scope.judokaNotEncode = [];
    JudokaCompetition.findNotEncode($id).then(function(data){
        $scope.judokaNotEncode = data.judoka_competition || [];
    }, function(msg){ alert(msg); })    
    
    $scope.encodeJudoka = function(encode){
        Judoka.getByName(encode.name, {mine : 1, club : encode.club}).then(function(judoka){
            JudokaCompetition.addJudoka($id, judoka.id, 1, 0, encode.weigh).then(function(data){
                data.judoka = judoka;
                $scope.judokaNotEncode.push(data);
            }, function(msg){ alert(msg); });
        }, function(msg){ alert(msg) });
    }
});

app.controller('TabCtrl', function ($scope, $stateParams, JudokaCompetition, Fight){
    $id = $stateParams.id;
    
    JudokaCompetition.getOne($id).then(function(data){
        Fight.findByCategory(data.category_competition_id).then(function(data){
            $scope.tab = {};
            angular.forEach(data, function(value, key) {
                if(!$scope.tab[value.type]){
                    $scope.tab[value.type] = {};
                }
                $scope.tab[value.type][value.number] = {};
                $scope.tab[value.type][value.number][1] = value.white;
                $scope.tab[value.type][value.number][2] = value.blue;
                $scope.tab[value.type][value.number]["fight"] = value;
            });
        }, function(msg){ alert(msg) });
    }, function(msg){ alert(msg) });
});

app.controller('PouleCtrl', function ($scope, $stateParams, JudokaCompetition, Fight){
    $id = $stateParams.id;
    
    JudokaCompetition.getOne($id).then(function(data){
        
        JudokaCompetition.findList(data.category_competition_id).then(function(data){
            $scope.list = data;
        }, 
        function(msg){ alert(msg) });
        
        Fight.findList(data.category_competition_id).then(function(data){
            $scope.tab = data;
//            angular.forEach(data, function(value, key) {
//                $scope.tab[value.white_id+'-'+value.blue_id] = value.white;
//            });
        }, function(msg){ alert(msg) });
    }, function(msg){ alert(msg) });
    
    $scope.win = function(one, two){
        if(one == two){
            return -1;
        }
        var key = one+'-'+two;
        if($scope.tab[key] == one){
            return 1;
        }
        if($scope.tab[key] == two){
            return 2;
        }
        return 0;
    }  
});

app.controller('encodeTabCtrl', function ($scope, $stateParams, $q, $window, Judoka, JudokaCompetition, CategoryCompetition, Fight){
    $id = $stateParams.id;
      
    CategoryCompetition.getCategory($id).then(function(data){
        $scope.category_competition = data;
    }, function(msg){ alert(msg); })
    
    Judoka.find().then(function(data){
        $scope.judokaList = data;
    }, function(msg){ alert(msg); })
    
    $scope.type = 1;
    $scope.list = [];
    $scope.form = {};
    $scope.form.oneText = ""; $scope.form.oneMine = false; $scope.form.oneUnknown = false;
    $scope.form.twoText = ""; $scope.form.twoMine = false; $scope.form.twoUnknown = false;
    
    $scope.data = {};
    $scope.data.edit = false;
    
    $scope.add = function(){
        if($scope.form.oneUnknown){
            $scope.form.oneText = $scope.list.length + 1;
        }
        $scope.list.push(
        {
            name: $scope.form.oneText, 
            mine: $scope.form.oneMine,
            club: $scope.form.oneClub,
            weigh: $scope.form.oneWeigh
        });
        
        $scope.form.oneText = "";
        $scope.form.oneMine = false;
        if($scope.form.twoUnknown){
            $scope.form.twoText = $scope.list.length + 1;
        }
        $scope.list.push(
        {
            name: $scope.form.twoText, 
            mine: $scope.form.twoMine,
            club: $scope.form.twoClub,
            weigh: $scope.form.twoWeigh
        });
        $scope.form.twoText = "";
        $scope.form.twoMine = false;
        
        $scope.hideForm();
    }
    $scope.encodeType = function(type){
        $scope.type = type;
           
        $scope.hideForm();
    }

    $scope.edit = function(index, judoka){
        $scope.list[index] = judoka;
    }
    
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.list.splice(fromIndex, 1);
      $scope.list.splice(toIndex, 0, item);
    };

    $scope.onItemDelete = function(item) {
      $scope.list.splice($scope.list.indexOf(item), 1);
    };

    $scope.save = function(){
        $tab = {};
        CategoryCompetition.addChild($scope.category_competition.competition_id, $scope.category_competition.category_id, $scope.type)
        .then(function(data){
            var deferred = $q.defer();
            $category_competition = data;
            angular.forEach($scope.list, function(value, key) {
                var kKey = key+1;
                value.weight = value.weight || 0;
                if(value.mine){
                    //update
                    Judoka.getByName(value.name).then(function(data){
                        JudokaCompetition.updateJudoka($id, $category_competition.id, data.id, kKey, 1).then(function(data){

                        }, function(msg){ alert(msg); });
                        $tab[kKey] = data.id;
                        if($scope.list.length == Object.keys($tab).length){
                            deferred.resolve(true);
                        }
                    }, function(msg){ alert(msg) });
                }else{
                    if(value.name === ""){
                        $tab[kKey] = 0;                           
                        if($scope.list.length == Object.keys($tab).length){
                            deferred.resolve(true);
                        }
                    }else{
                        Judoka.getByName(value.name, true).then(function(data){
                            JudokaCompetition.addJudoka($category_competition.id, data.id, 0, kKey, value.weight).then(function(data){

                            }, function(msg){ alert(msg); });
                            $tab[kKey] = data.id;
                            if($scope.list.length == Object.keys($tab).length){
                                deferred.resolve(true);
                            }
                        }, function(msg){ alert(msg) });
                    }
                }
            });
            return deferred.promise;
        }, function(msg){ alert(msg); })
        .then(function(data){
            Fight.addCategory($scope.type, $category_competition.id, $tab).then(function(data){
                $window.location = '#/app/category/'+$id;
            }, function(msg){ alert(msg); });
        }, function(msg){ alert(msg); });
    }
    
    $scope.show = function(index){
        index++;
        if($scope.type == 1){
            return false;
        }
        if(($scope.type == 2 && index%2 == 0) || ($scope.type == 3 && index%4 == 0)){
            return true
        }
        return false;
    }
    $scope.formHide = false;
    $scope.hideForm = function(){
        if($scope.type == 1 && $scope.list.length > 5){
            $scope.formHide = true;
        }else{
            $scope.formHide = false;
        }
    }
});

app.controller('FightCtrl', function ($scope, $stateParams, $window, Fight){
    $id = $stateParams.id;
    var tab = {"I" : {pond : 1000, max : 1}, "W" : {pond : 100, max : 2}, "Y" : {pond : 10, max : 9}, "P" : {pond : 1, max : 4}}
        
    Fight.getOneWithJoin($id).then(function(data){
        $scope.fight = data;

        $scope.tabPoint = [];
        $scope.tabPoint["scoreWhite"] = {};
        $scope.tabPoint["scoreBlue"] = {};
        
        var w = data.score_white;
        var b = data.score_blue;
        angular.forEach(tab, function(val, key) {
            $scope.tabPoint["scoreWhite"][key] = Math.floor(w/val.pond);
            w = w%val.pond;
            $scope.tabPoint["scoreBlue"][key] = Math.floor(b/val.pond);
            b = b%val.pond;
        });
    }, function(msg){ alert(msg) });
    $scope.win = "1";
    
    $scope.mark = [];
    $scope.mark.push({key : 'I', value : "I", max : 1});
    $scope.mark.push({key : 'W', value : "W", max : 2});
    $scope.mark.push({key : 'Y', value : "Y", max : 9});
    $scope.mark.push({key : 'P', value : "P", max : 4});
        
    $scope.point = function(type, score, who){
        if(type == "+"){
            if($scope.tabPoint[who][score] < tab[score].max){
                $scope.tabPoint[who][score] += 1;
                $scope.win = whoWin();
            }
        }else{
            if($scope.tabPoint[who][score] > 0){
                $scope.tabPoint[who][score] -= 1;
                $scope.win = whoWin();
            }
        }
    }
    function whoWin(){
        for (var key in tab) {
            if(key != 'P'){
                if($scope.tabPoint['scoreWhite'][key] > $scope.tabPoint['scoreBlue'][key]){
                    return "1";
                }else if($scope.tabPoint['scoreWhite'][key] < $scope.tabPoint['scoreBlue'][key]){
                    return "2";
                }
            }
            
        }
        return "1";
    }
    $scope.save = function(){
        var scoreWhite = 0;
        var scoreBlue = 0;
        for (var key in tab) {
            scoreWhite += ($scope.tabPoint['scoreWhite'][key]*tab[key].pond);
            scoreBlue += ($scope.tabPoint['scoreBlue'][key]*tab[key].pond);
        }
        var win = ($scope.win == "1")? $scope.fight.white_id : $scope.fight.blue_id;
        Fight.updateFinish($id, scoreWhite, scoreBlue, win).then(function(data){
            $window.location = '#/app/tab/'+$scope.fight.category_competition_id;
        }, function(msg){ alert(msg) });
    }
});


//app.directive('ngCategories', function(){
//    return {
//        scope : {
//            item : '=parent'
//        },
//        restrict: 'E',
//        templateUrl: 'partials/category.html'
//    }
//});





app.controller('categoryCategoriesCtrl', function ($scope, $stateParams, CategoryCompetition){
    $id = $stateParams.id;
    CategoryCompetition.getCategory($id).then(function(data){
        CategoryCompetition.findCategories(data.competition_id).then(function(data){
            $scope.listCategories = data;
            console.log(data);
        }, function(msg){ alert(msg); });
    }, function(msg){ alert(msg); });
});