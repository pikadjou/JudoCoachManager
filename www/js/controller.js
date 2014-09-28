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
    
    $scope.categoriesPresent = [];
    CategoryCompetition.findCategories($idCompetiton).then(function(data){
        $scope.categoriesPresent = data;
    }, function(msg){ alert(msg); });
    
    $scope.encodeCategory = function(name){
        Category.getByName(name, true).then(function(id){
            CategoryCompetition.addCategory($idCompetiton, id).then(function(data){
                $scope.categoriesPresent.push(data);
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
    }, function(msg){ alert(msg); });
    
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

app.controller('PouleCtrl', function ($scope, $stateParams, $q, JudokaCompetition, Fight){
    $id = $stateParams.id;
    
    JudokaCompetition.getOne($id).then(function(data){
        
        Fight.findByCategory(data.category_competition_id).then(function(data){
            var deferred = $q.defer();
            $scope.tab = {};
            angular.forEach(data, function(value, key) {
                $scope.tab[value.white_id+'-'+value.blue_id] = value;
                if(Object.keys($scope.tab).length == data.length){
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        }, function(msg){ alert(msg) })
        .then(function(bool){
            JudokaCompetition.findList(data.category_competition_id).then(function(data){
                $scope.list = data;
            }, function(msg){ alert(msg) });
        }, function(msg){ alert(msg) });
        
    }, function(msg){ alert(msg) });

    $scope.win = function(one, two){
        if(one == two){
            return {key :-1};
        }
        var key = one+'-'+two;
        var keyI = two+'-'+one;
        var value = null;
        if($scope.tab[key]){
             value =  $scope.tab[key];
        }
        if($scope.tab[keyI]){
            value = $scope.tab[keyI];
        }
        if(value == null){
            return {key :-1};
        }
        if(value.winner == 0){
            return {key : 0, id: value.id};
        }
        return {key : 1, value: value};
    }
    
    $scope.bestScore = function(value){
        var score = ((value.winner == value.white_id)? value.score_white : value.score_blue);
        
        if(is_int(score % $tabScore["I"].pond)){
            return "I";
        }
        if(is_int(score % $tabScore["W"].pond)){
            return "W";
        }
        if(is_int(score % $tabScore["Y"].pond)){
            return "Y";
        }
        return "A"
    }
});

app.controller('encodeTabCtrl', function ($scope, $stateParams, $q, $window, Judoka, JudokaCompetition, CategoryCompetition, Fight){
    $id = $stateParams.id; //$id => id -> judokas_competitons
      
    JudokaCompetition.getOne($id).then(function(data){
        CategoryCompetition.getCategory(data.category_competition_id).then(function(data){
            $scope.category_competition = data;
            console.log(data);
        }, function(msg){ alert(msg); })
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

app.controller('FightCtrl', function ($scope, $stateParams, $window, Fight, CategoryCompetition){
    $id = $stateParams.id;
        
    
    Fight.getOneWithJoin($id).then(function(data){
        CategoryCompetition.getOne(data.category_competition_id).then(function(data){
            $scope.categoryCompetition = data;
        }, function(msg){ alert(msg) });
        $scope.fight = data;

        $scope.tabPoint = [];
        $scope.tabPoint["scoreWhite"] = {};
        $scope.tabPoint["scoreBlue"] = {};
        
        var w = data.score_white;
        var b = data.score_blue;
        angular.forEach($tabScore, function(val, key) {
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
            if($scope.tabPoint[who][score] < $tabScore[score].max){
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
        for (var key in $tabScore) {
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
        for (var key in $tabScore) {
            scoreWhite += ($scope.tabPoint['scoreWhite'][key]*$tabScore[key].pond);
            scoreBlue += ($scope.tabPoint['scoreBlue'][key]*$tabScore[key].pond);
        }
        var win = ($scope.win == "1")? $scope.fight.white_id : $scope.fight.blue_id;
        Fight.updateFinish($id, scoreWhite, scoreBlue, win).then(function(data){
            if($scope.categoryCompetition.number == 1){
                $window.location = '#/app/poule/'+$scope.categoryCompetition.id;
            }else if($scope.categoryCompetition.number == 2){
                $window.location = '#/app/tab/'+$scope.categoryCompetition.id;
            }else{
                $window.location = '#/app/tab/'+$scope.categoryCompetition.id;
            }
            
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

function is_int(value){
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
      return true;
  } else {
      return false;
  }
}

$tabScore = {"I" : {pond : 1000, max : 1}, "W" : {pond : 100, max : 2}, "Y" : {pond : 10, max : 9}, "P" : {pond : 1, max : 4}}