function CompetitionCtrl($scope){
    $scope.list = [
            {
                "id": 0,
                "name": "Levine Colon",
                "date": "Mon Dec 08 2008 13:09:05 GMT+0100 (Paris, Madrid)"
            },
            {
                "id": 1,
                "name": "Eunice Cole",
                "date": "Sun Jan 10 1982 19:42:17 GMT+0100 (Paris, Madrid)"
            },
            {
                "id": 2,
                "name": "Franklin Ellis",
                "date": "Wed Mar 16 1988 06:40:32 GMT+0100 (Paris, Madrid)"
            },
            {
                "id": 3,
                "name": "Mccray Jimenez",
                "date": "Thu Oct 04 1973 09:41:26 GMT+0200 (Paris, Madrid (heure d’été))"
            },
            {
                "id": 4,
                "name": "Mckay Ward",
                "date": "Sat Oct 13 1973 05:40:24 GMT+0200 (Paris, Madrid (heure d’été))"
            },
            {
                "id": 5,
                "name": "Jordan Brown",
                "date": "Wed Jun 17 1970 23:30:10 GMT+0200 (Paris, Madrid (heure d’été))"
            },
            {
                "id": 6,
                "name": "Elba Byrd",
                "date": "Fri Mar 11 1983 08:02:09 GMT+0100 (Paris, Madrid)"
            },
            {
                "id": 7,
                "name": "Snow Knapp",
                "date": "Thu Apr 16 1970 01:41:32 GMT+0200 (Paris, Madrid (heure d’été))"
            },
            {
                "id": 8,
                "name": "Sofia Bright",
                "date": "Sun Aug 10 1986 20:07:57 GMT+0200 (Paris, Madrid (heure d’été))"
            }
         ];
    
    $scope.encode = function(name){
        $scope.list[$scope.list.length] = {
                "id": 0,
                "name": name,
                "date": ''
            }
    }
}


