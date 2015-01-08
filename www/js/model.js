app.factory('Config', function($q){
    var factory = {   
        find : function(){
            var deferred = $q.defer();
            $db.transaction(function(tx){
                tx.executeSql('SELECT * FROM COMPETITIONS ORDER BY created DESC', [], 
                    function(tx, results){
                        var data = [];
                        for (var i=0; i<results.rows.length; i++){
                            data[results.rows.item(i).id] = results.rows.item(i);
                            deferred.resolve(data);
                        }
                    }, function (tx, err) { deferred.reject("Erreur de traitement SQL : "+err); },
                    function (tx, err) { deferred.reject("Erreur de traitement SQL : "+err); }
                )
            });
            return deferred.promise;
        },
        addOne : function(data){
            var deferred = $q.defer();
            $db.transaction(function(tx){
                var d = new Date();
                tx.executeSql("INSERT INTO COMPETITIONS(name,created) values(?,?)",[data.name,d.getTime()], 
                    function(tx, results){
                        deferred.resolve(results);
                    }, function (tx, err) { deferred.reject("Erreur de traitement SQL : "+err); }
                ),
                function (tx, err) { deferred.reject("Erreur de traitement SQL : "+err); }
            });
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('DbFatory', function($q){
    var factory = {
        mapping : 
        {
            competitions :
            {
                name : "COMPETITIONS",
                params : {
                    name : 0,
                    created : 0
                }
            },
            categories :
            {
                name : "CATEGORIES",
                params : {
                    name : 0
                }
            },
            categoriesCompetitions :
            {
                name : "CATEGORIES_COMPETITIONS",
                params : {
                    category_id : 0,
                    competition_id : 0,
                    number : 0
                }
            },
            judokasCompetitions :
            {
                name : "JUDOKAS_COMPETITIONS",
                params : {
                    category_competition_id : 0,
                    judoka_id : 0,
                    place : 0,
                    number : 0,
                    fights : 0,
                    mine : 0,
                    weigh : ""
                }
            },
            judokas :
            {
                name : "JUDOKAS",
                params : {
                    name : 0,
                    club : 0,
                    mine : 0
                }
            },
            fights :
            {
                name : "FIGHTS",
                params : {
                    category_competition_id : 0,
                    white_id : 0,
                    blue_id : 0,
                    number: 0,
                    type: 0,
                    score_white : "0000",
                    score_blue : "0000",
                    winner: 0
                }
            }
        },
        getMapping : function(){
            var copie = angular.copy(factory.mapping);
            return copie;
        },
        sleep : function (milliseconds) {
          var start = new Date().getTime();
          for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
              break;
            }
          }
        },
        all : function(config){
            /*console.log(config);*/
            var deferred = $q.defer();
            $db.transaction(function(tx){
                var sql = "SELECT * FROM "+config.name+' ORDER BY id;';
                console.log(sql);
                tx.executeSql(sql, config.data,
                    function(tx, results){
                        var data = {};
                        for (var i=0; i<results.rows.length; i++){
                            data[i] = results.rows.item(i);
                        }
                        /*console.log(data);*/
                });       
            });
            return deferred.promise;
        },
        find : function(config){
            if(typeof(config.select)==='undefined') config.select = "*";
            if(typeof(config.where)==='undefined') config.where = "";
            if(typeof(config.order)==='undefined') config.order = "";
            if(typeof(config.data)==='undefined') config.data = [];
            if(typeof(config.join)==='undefined') config.join = false;
            var deferred = $q.defer();
            $db.transaction(function(tx){
                var sql = "SELECT "+config.select+" FROM "+config.name;
                if(!config.where.length == 0){
                    sql = sql.concat(' WHERE '+config.where);
                }
                if(!config.order.length == 0){
                    sql = sql.concat(' ORDER BY '+config.order);
                }
                sql = sql.concat(';');
                console.log(sql);
                tx.executeSql(sql, config.data,
                    function(tx, results){
                        var data = [];
                        if(!config.join){
                            for (var i=0; i<results.rows.length; i++){
                                data[i] = results.rows.item(i);
                            }
                            deferred.resolve(data);
                        }else{
                            if(!Array.isArray(config.join)){
                                config.join = [config.join];
                            }
                            var maxNbEnr = config.join.length*results.rows.length;
                            for(var cpt = 0; cpt < config.join.length; cpt++){
                                
                                if(typeof(config.join[cpt].type)==='undefined') config.join[cpt].type = 'find';
                                if(typeof(config.join[cpt].conditionType)==='undefined') config.join[cpt].conditionType = 1;

                                var retour = 0;
                                for (var i=0; i<results.rows.length; i++){
                                    data[i] = results.rows.item(i);
                                    var join = angular.copy(config.join[cpt]);
                                    if(config.join[cpt].conditionType == 2){
                                        join.config.where = ""+config.join[cpt].condition+" = "+ data[i].id;
                                    }else{
                                        join.config.where = "id = "+ data[i][""+config.join[cpt].condition+""];
                                    }

                                    var fct = function(indice, join, vcpt){
                                        var def = $q.defer();
                                        var data = {};
                                        if(config.join[vcpt].type == 'find'){
                                            factory.find(join.config).then(function(d){
                                                data.data = d;
                                                data.indice = indice;
                                                data.cpt = vcpt;
                                                def.resolve(data);
                                            }, function(msg){ alert(msg); });
                                        }else{
                                            factory.get(join.config).then(function(d){
                                                data.data = d;
                                                data.indice = indice;
                                                data.cpt = vcpt;
                                                def.resolve(data);
                                            }, function(msg){ alert(msg); });
                                        }
                                        return def.promise;
                                    }
                                    fct(i, join, cpt).then(function(d){
                                        data[d.indice][""+config.join[d.cpt].name+""] = d.data;
                                        retour++;
                                        if(retour >= maxNbEnr){
                                            deferred.resolve(data);
                                        }
                                    });
                                }
                            }
                        }
                    }, function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); },
                    function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); }
                )
            });
            return deferred.promise;
        },
        get : function(config){
            if(typeof(config.select)==='undefined') config.select = "*";
            if(typeof(config.data)==='undefined') config.data = [];
            if(typeof(config.where)==='undefined') config.where = "";
            if(typeof(config.join)==='undefined') config.join = false;
            var deferred = $q.defer();
            
            $db.transaction(function(tx){
                var sql = "SELECT "+config.select+" FROM "+config.name;
                if(!config.where.length == 0){
                    sql = sql.concat(' WHERE '+config.where);
                }
                sql = sql.concat(' LIMIT 1;');
                console.log(sql);
                tx.executeSql(sql, [],
                    function(tx, results){
                        var data = [];
                        for (var i=0; i<results.rows.length; i++){
                            data[i] = results.rows.item(i);
                        }
                        if(data.length > 0){
                            if(config.join){
                                if(typeof(config.join.type)==='undefined') config.join.type = 'find';
                                if(typeof(config.join.conditionType)==='undefined') config.join.conditionType = 1;
                            
                                if(config.join.conditionType == 2){
                                    config.join.config.where = ""+config.join.condition+" = "+ data[0].id;
                                }else{
                                    config.join.config.where = "id = "+ data[0][""+config.join.condition+""];
                                }
                                
                                if(config.join.type == 'find'){
                                    factory.find(config.join.config).then(function(d){
                                        data[0][""+config.join.name+""] = d;
                                        deferred.resolve(data[0]);
                                    }, function(msg){ alert(msg) });
                                }else{
                                    factory.get(config.join.config).then(function(d){
                                        data[0][""+config.join.name+""] = d;
                                        deferred.resolve(data[0]);
                                    }, function(msg){ alert(msg) });
                                }
                            }else{
                                deferred.resolve(data[0]);
                            }
                        }else{
                            deferred.resolve(false);
                        }
                    }, function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); },
                    function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); }
                )
            });
            return deferred.promise;
        },
        add : function(config){

            var deferred = $q.defer();
            $db.transaction(function(tx){
                $sql = "INSERT INTO "+config.name+"(";
                $valueS = "(";
                $value = [];
                angular.forEach(config.params, function(value, key) {
                    $sql = $sql.concat(key+',');
                    $valueS = $valueS.concat('?,');
                    $value.push(value);
                });
                $sql = $sql.substring(0,$sql.length-1).concat(')');
                $valueS = $valueS.substring(0,$valueS.length-1).concat(')');
                $sql = $sql.concat(' VALUES '+$valueS+';');
                
                console.log($sql);
                console.log($value);
                
                tx.executeSql($sql,$value,
                    function(tx, results){
                        console.log(results.insertId);
                        deferred.resolve(results);
                    }, function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); }
                ),
                function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err); }
            });
            return deferred.promise;
        },
        update : function(config){
            factory.all(config);
            var deferred = $q.defer();
            $db.transaction(function(tx){
                $sql = "UPDATE "+config.name;
                $sql = $sql.concat(" SET "+config.set);
                $sql = $sql.concat(" WHERE "+config.where);
                $sql = $sql.concat(";");
                console.log($sql);
                
                tx.executeSql($sql,[],
                    function(tx, results){
                        console.log(results.rowsAffected);
                        deferred.resolve(results);
                    }, function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); }
                ),
                function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err); }
            });
            return deferred.promise;
        },
        remove : function(config){
            factory.all(config);
            var deferred = $q.defer();
            $db.transaction(function(tx){
                $sql = "DELETE FROM "+config.name;
                $sql = $sql.concat(" WHERE "+config.where);
                $sql = $sql.concat(";");
                console.log($sql);
                
                tx.executeSql($sql,[],
                    function(tx, results){
                        console.log(results.rowsAffected);
                        deferred.resolve(results);
                    }, function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err.message); }
                ),
                function (tx, err) { alert(err.message); console.log(err.message); deferred.reject("Erreur de traitement SQL : "+err); }
            });
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('Competition', function($q, DbFatory){
    var factory = {
        getMapping : function(){
            return DbFatory.getMapping().competitions;
        },
        find : function(){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.order = "created DESC";
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        addOne : function(data, created){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.name = data.name;
            config.params.created = new Date(created).getTime() || new Date().getTime();
            DbFatory.add(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        update : function(data){
            var deferred = $q.defer();

            var config = factory.getMapping();
            config.set = "name = '"+ data.name+"', created = "+ new Date(data.created).getTime() || new Date().getTime();
            config.where = "id = "+ data.id;
            
            DbFatory.update(config)
                .then(function(data){
                    deferred.resolve(data);
                },
                function(msg){ deferred.reject(msg); } 
            );
            return deferred.promise;
        },
        remove : function(data){
            var deferred = $q.defer();

            var config = factory.getMapping();
            config.where = "id = "+ data.id;
            
            DbFatory.remove(config)
                .then(function(data){
                    deferred.resolve(data);
                },
                function(msg){ deferred.reject(msg); } 
            );
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('Category', function($q, DbFatory){
    var factory = {
        getMapping : function(){
            return DbFatory.getMapping().categories;
        },
        find : function(){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.order = "name ASC";
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getByName : function(name, encode){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'name = "'+ name+'"';
            DbFatory.get(config)
                .then(function(data){
                        if(encode){
                            if(!data){
                                factory.addOne(name).then(function(id){
                                    deferred.resolve(id.insertId);
                                }, function(msg){ deferred.reject(msg); } )
                            }else{
                                deferred.resolve(data.id);
                            }
                        }else{
                            deferred.resolve(data);  
                        }
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        addOne : function(name){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.name = name;
            DbFatory.add(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('CategoryCompetition', function($q, DbFatory){
    var factory = {
        getMapping : function(){
            return DbFatory.getMapping().categoriesCompetitions;
        },
        findCategories : function(idCompetition){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.order = "id ASC";
            config.where = 'number = 0 AND competition_id = '+idCompetition;
            
            config.join = {};
            config.join.name = "category";
            config.join.config = DbFatory.getMapping().categories;
            config.join.condition = "category_id";
            config.join.type = "get";
            
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        findChild : function(id){
            var deferred = $q.defer();
                        
            factory.getOne(id).then(function(parent){
                var config = factory.getMapping();
                config.where = "competition_id = " + parent.competition_id + " AND category_id = " + parent.category_id + " AND number != 0";

                DbFatory.find(config)
                    .then(function(data){
                            deferred.resolve(data);
                         },
                         function(msg){ deferred.reject(msg); } 
                     );
            }, function(msg){ deferred.reject(msg); });
            
            return deferred.promise;
        },
        getOne : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = '+id;
            
            DbFatory.get(config)
                .then(function(data){
                        deferred.resolve(data);
                },function(msg){ deferred.reject(msg); });
            return deferred.promise;
        },
        getCategory : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = '+id;
            
            config.join = {};
            config.join.name = "category";
            config.join.config = DbFatory.getMapping().categories;
            config.join.condition = "category_id";
            config.join.type = "get";
            
            DbFatory.get(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        addCategory : function(idCompetition, idCategory){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.competition_id = idCompetition;
            config.params.category_id = idCategory;
            DbFatory.add(config)
                .then(function(data){
                        factory.getCategory(data.insertId).then(function(data){
                            deferred.resolve(data);
                        }, function(msg){ deferred.reject(msg) });
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        addChild : function(idCompetition, idCategory, number){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.competition_id = idCompetition;
            config.params.category_id = idCategory;
            config.params.number = number;
            DbFatory.add(config)
                .then(function(data){
                        factory.getOne(data.insertId).then(function(data){
                            deferred.resolve(data);
                        }, function(msg){ deferred.reject(msg) });
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('JudokaCompetition', function($q, DbFatory, CategoryCompetition){
    var factory = {
        getMapping : function(){
            return DbFatory.getMapping().judokasCompetitions;
        },
        findNotEncode : function(id){
            var deferred = $q.defer();
            var config = DbFatory.getMapping().categoriesCompetitions;
            config.where = 'id = '+ id;
            
            config.join = {};
            config.join.name = "judoka_competition";
            config.join.config = factory.getMapping();
            config.join.condition = "category_competition_id";
            config.join.conditionType = 2;
            config.join.type = "find";
            
            config.join.config.join = {};
            config.join.config.join.name = "judoka";
            config.join.config.join.config = DbFatory.getMapping().judokas;
            config.join.config.join.condition = "judoka_id";
            config.join.config.join.condition.type = 1;
            config.join.config.join.type = "get";

            DbFatory.get(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        findEncode : function(id){
            var deferred = $q.defer();
            CategoryCompetition.findChild(id).then(function(data){
                
                if(data.length > 0){
                    var condIn = '(';
                    for(var i = 0; i < data.length; i++){
                        condIn = condIn + data[i].id+ ",";
                    }
                    condIn = condIn.substr(0, condIn.length-1);
                    condIn = condIn +")";

                    var config = factory.getMapping();
                    config.where = 'mine = 1 AND category_competition_id IN '+condIn;

                    var join1 = {};
                    join1.name = "judoka";
                    join1.config = DbFatory.getMapping().judokas;
                    join1.condition = "judoka_id";
                    join1.type = "get";

                    var join2 = {};
                    join2.name = "category_competition";
                    join2.config = DbFatory.getMapping().categoriesCompetitions;
                    join2.condition = "category_competition_id";
                    join2.type = "get";

                    config.join = [join1, join2];

                    DbFatory.find(config)
                        .then(function(data){
                                deferred.resolve(data);
                             },
                             function(msg){ deferred.reject(msg); } 
                         );
                }else{
                    deferred.resolve([]);
                }
             },function(msg){ deferred.reject(msg); });
            
            return deferred.promise;
        },
        findList: function(category_competiton){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'category_competition_id = '+ category_competiton;
            
            config.join = {};
            config.join.name = "judoka";
            config.join.config = DbFatory.getMapping().judokas;
            config.join.condition = "judoka_id";
            config.join.condition.type = 1;
            config.join.type = "get";

            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getOne : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = '+id;
            
            DbFatory.get(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getCategory : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = '+id;
            
            DbFatory.get(config)
                .then(function(data){
                        var config = DbFatory.getMapping().categoriesCompetitions;
                        config.where = 'id = '+data.category_competition_id+' AND number == 0';
                        DbFatory.get(config)
                            .then(function(data){
                                    deferred.resolve(data);
                                 },
                                 function(msg){ deferred.reject(msg); } 
                             );
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        updateJudoka : function(Oid, Nid, idJoduka, number, mine){
            mine = mine || 0;
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.set = "category_competition_id = "+ Nid+", number = "+ number+", mine = "+ mine;
            config.where = "category_competition_id = "+ Oid +" AND judoka_id = "+ idJoduka;
            
            DbFatory.update(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        updateFight : function (category_competiton_id, white_id, blue_id){
            var deferred = $q.defer();
            CategoryCompetition.getOne(category_competiton_id).then(function(data){
                if(data.number == 1){
                    factory.updateFightPoule(category_competiton_id, white_id, blue_id).then(function(data){
                        deferred.resolve(data);
                     },function(msg){ deferred.reject(msg); });
                }else{
                    factory.updateFightTab(category_competiton_id, white_id, blue_id).then(function(data){
                        deferred.resolve(data);
                    },function(msg){ deferred.reject(msg); });
                }
             },function(msg){ deferred.reject(msg); });
            return deferred.promise;
        },
        updateFightTab : function(category_competiton_id, white_id, blue_id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.set = "fights = fights+1";
            config.where = "category_competition_id = "+ category_competiton_id +" AND (judoka_id = "+ white_id +" OR judoka_id = "+ blue_id+")";
            
            DbFatory.update(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); }
                 );
            return deferred.promise;
        },
        updateFightPoule : function(category_competiton_id, white_id, blue_id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.set = "fights = fights+1";
            config.where = "category_competition_id = "+ category_competiton_id +" AND (judoka_id = "+ white_id +" OR judoka_id = "+ blue_id+")";
            
            DbFatory.update(config).then(function(data){
                
            },function(msg){ deferred.reject(msg); });
            
            return deferred.promise;
        },
        addJudoka : function(id, judokaId, mine, number, weigh){
            number = TestNull(number, 0);
            mine = TestNull(mine, 0);
            weigh = TestNull(weigh, 0);
            
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.category_competition_id = id;
            config.params.judoka_id = judokaId;
            config.params.mine = mine;
            config.params.number = number;
            config.params.weigh = weigh;
            
            DbFatory.add(config)
                .then(function(data){
                        factory.getOne(data.insertId).then(function(data){
                            deferred.resolve(data);
                        }, function(msg){ deferred.reject(msg); });
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('Judoka', function($q, DbFatory){
    var factory = {
        getMapping : function(){
            return DbFatory.getMapping().judokas;
        },
        findOther : function(){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.order = "name ASC";
            config.where = 'mine = 0';
            config.select = 'name, id';
            
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        find : function(){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.order = "name ASC";

            
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        findMine : function(){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.order = "name ASC";
            config.where = 'mine = 1';
            config.select = 'name, id';
            
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getOne : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = "'+ id+'"';
            DbFatory.get(config)
                .then(function(data){
                        deferred.resolve(data);  
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getByName : function(name, encode){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'name = "'+ name+'"';
            DbFatory.get(config)
                .then(function(data){
                        if(TestNull(encode)){
                            if(!data){
                                encode.club = TestNull(encode.club, "");
                                encode.mine = TestNull(encode.mine, 0);
                                factory.add(name, encode.club, encode.mine).then(function(data){
                                    factory.getOne(data.insertId).then(function(data){
                                        deferred.resolve(data);
                                    },function(msg){ deferred.reject(msg); });
                                },function(msg){ deferred.reject(msg); });
                            }else{
                                deferred.resolve(data);
                            }
                        }else{
                            deferred.resolve(data);
                        }
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        add : function(name, club, mine){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.name = name;
            config.params.club = club || config.params.club;
            config.params.mine = mine || config.params.mine;
            
            DbFatory.add(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        }
    }
    return factory;
});

app.factory('Fight', function($q, DbFatory, JudokaCompetition){
    var factory = {
        getMapping : function(){
            return DbFatory.getMapping().fights;
        },
        getCombat : function(categoryCompetitionId, type, number){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = "category_competition_id = "+ categoryCompetitionId+" AND "+
                            "type = "+ type+" AND "+
                            "number = "+ number;
            DbFatory.get(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getOne : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = '+id;
            
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data[0]);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        getOneWithJoin : function(id){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'id = '+id;
            
            var join1 = {};
            join1.name = "white";
            join1.config = DbFatory.getMapping().judokas;
            join1.condition = "white_id";
            join1.type = "get";
            
            var join2 = {};
            join2.name = "blue";
            join2.config = DbFatory.getMapping().judokas;
            join2.condition = "blue_id";
            join2.type = "get";
            
            config.join = [join1, join2];
            
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data[0]);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        findByCategory : function(categrodyId){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.where = 'category_competition_id = '+ categrodyId;
            config.order = 'type DESC, number ASC';
            
            var join1 = {};
            join1.name = "white";
            join1.config = DbFatory.getMapping().judokas;
            join1.condition = "white_id";
            join1.type = "get";
            
            var join2 = {};
            join2.name = "blue";
            join2.config = DbFatory.getMapping().judokas;
            join2.condition = "blue_id";
            join2.type = "get";
            
            config.join = [join1, join2];
            DbFatory.find(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        addCategory : function(type, idCategory, tab){
            var deferred = $q.defer();
            if(type == 1){
                factory.addPoule(idCategory, tab)
                    .then(function(data){ deferred.resolve(true); },
                     function(msg){ deferred.reject(msg); } 
                 );
            }else if(type == 2){
                factory.addTab(idCategory, tab).then(function(data){ deferred.resolve(true); },
                     function(msg){ deferred.reject(msg); } 
                 );
            }else if(type == 3){
                factory.addMixte(idCategory, tab).then(function(data){ deferred.resolve(true); },
                     function(msg){ deferred.reject(msg); } 
                 );
            }else{
                deferred.reject(false);
            }
            return deferred.promise;
        },
        addPoule : function(idCategory, tab){
            var deferred = $q.defer();
            var max = Object.keys($tab).length;
            
            var x = 1;
            for(var i = 1; i <= max; i++){
                for(var j = i+1; j <= max; j++){
                    var f = function(i,j){
                        factory.addCombat(idCategory, tab[i], tab[j], x).then(function(data){
                            if(i == max-1 && j == max){
                                deferred.resolve(true);
                            }
                        },function(msg){ deferred.reject(msg); });
                    }
                    f(i, j);
                    x++;
                }
            }
            return deferred.promise;
        },
        addTab : function(idCategory, tab){
            var deferred = $q.defer();
            var max = Object.keys(tab).length;
            
            var log = Math.log(max) / Math.LN2;
            if(!is_int(log)){
                var nb = Math.ceil(log);
                var maxT = Math.pow(2, nb);
                for(var i = max+1; i <= maxT; i++){
                    tab[i] = 0;
                }
            }
            var recursive = function(i){
                if(i > max){
                    deferred.resolve(true);
                }else{
                    var number = Math.round(i/2);
                    var f = function(j,  number){
                        var deferred = $q.defer();
                        factory.tryAdd(idCategory, tab[j], 1, max, number).then(function(data){
                            j++;
                            factory.tryAdd(idCategory, tab[j], 2, max, number)
                                .then(function(data){ 
                                    deferred.resolve(data);
                                },
                                function(msg){ deferred.reject(msg); });
                        },function(msg){ deferred.reject(msg); });

                        return deferred.promise;
                    }
                    f(i, number).then(function(){
                        recursive(i+2);
                    });
                }
            }
            recursive(1);
            return deferred.promise;
        },
        addMixte : function(idCategory, tab){
            console.log("mixte");
        },
        tryAdd : function(categoryCompetitionId, judokaId, wb, type, number){
            var deferred = $q.defer();
            factory.getCombat(categoryCompetitionId, type, number).then(function(data){
                if(data === false){
                    factory.add(categoryCompetitionId, judokaId, wb, type, number).then(function(data){
                        deferred.resolve(data);
                    },function(msg){ deferred.reject(msg); });
                }else{
                    factory.updateAdd(categoryCompetitionId, judokaId, wb, type, number).then(function(data){
                        deferred.resolve(data);
                    },function(msg){ deferred.reject(msg); });
                }
            });
            return deferred.promise;
        },
        addCombat : function(categoryCompetitionId, whiteId, blueId, number){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.category_competition_id = categoryCompetitionId;
            config.params.number = number;
            config.params.white_id = whiteId;
            config.params.blue_id = blueId;
            
            
            DbFatory.add(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        add : function(categoryCompetitionId, judokaId, wb, type, number){
            var deferred = $q.defer();
            var config = factory.getMapping();
            config.params.category_competition_id = categoryCompetitionId;
            config.params.type = type;
            config.params.number = number;
            if(wb == 1){
                config.params.white_id = judokaId;
                config.params.blue_id = -1;
            }else{
                config.params.blue_id = judokaId;
                config.params.white_id = -1;
            }
            
            DbFatory.add(config)
                .then(function(data){
                        deferred.resolve(data);
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        updateAdd : function(categoryCompetitionId, judokaId, wb, type, number){
            var deferred = $q.defer();
            var config = factory.getMapping();
            if(wb == 1){
                config.set = "white_id = "+ judokaId;
            }else{
                config.set = "blue_id = "+ judokaId;
            }
            
            config.where = "category_competition_id = "+ categoryCompetitionId +" AND type = "+ type+ " AND number = "+ number;
            
            DbFatory.update(config)
                .then(function(data){
                        factory.vsEmpty(categoryCompetitionId, judokaId, wb, type, number).then(function(data){
                            deferred.resolve(data);
                        }, function(msg){ deferred.reject(msg); });
                     },
                     function(msg){ deferred.reject(msg); } 
                 );
            return deferred.promise;
        },
        vsEmpty : function(categoryCompetitionId, judokaId, wb, type, number){
            var deferred = $q.defer();
            factory.getCombat(categoryCompetitionId, type, number).then(function(data){
                console.log("what");
                console.log(data);
                if(data.white_id == 0 || data.blue_id == 0){
                    judokaId = (data.white_id != 0) ? data.white_id : data.blue_id;
                    wb = (number%2 != 0) ? 1 : 2;
                    number = Math.round(number/2);
                    type = type/2;
                    factory.tryAdd(categoryCompetitionId, judokaId, wb, type, number).then(function(data){
                        deferred.resolve(data);
                    },function(msg){ deferred.reject(msg); });
                }else{
                    deferred.resolve(false);
                }
            },function(msg){ deferred.reject(msg); });
            return deferred.promise;
        },
        updateFinish : function(id, scoreWhite, scoreBlue, win){
            var deferred = $q.defer();
            var config = factory.getMapping();     
            config.set = "score_white = "+ scoreWhite +", score_blue = "+ scoreBlue +", winner = "+ win;
            config.where = "id = "+ id;
            
            DbFatory.update(config).then(function(data){
                
                factory.getOne(id).then(function(data){
                    console.log(data);
                    JudokaCompetition.updateFight(data.category_competition_id, data.white_id, data.blue_id).then(function(data){
                          //deferred.resolve(data);
                    }, function(msg){ deferred.reject(msg); });
                    if(data.type != 0){
                        factory.tryAdd(data.category_competition_id, win, (data.number%2 != 0)? 1 : 2 , data.type/2, Math.round(data.number/2)).then(function(data){
                              deferred.resolve(data);
                        }, function(msg){ deferred.reject(msg); });
                    }else{
                        deferred.resolve(true);
                    }
                }, function(msg){ deferred.reject(msg); });
                
            }, function(msg){ deferred.reject(msg); });

            return deferred.promise;
        }
    }
    return factory;
});

function TestNull(valeur, def){
    if(typeof(def)==='undefined'){
        if(typeof(valeur)==='undefined'){
            return false;
        }else{
            return true;
        }
    }else{
        if(typeof(valeur)==='undefined'){
            return def;
        }else{
            return valeur;
        }
    }
}


