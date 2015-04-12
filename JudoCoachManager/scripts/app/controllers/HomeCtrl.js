var JudoCoachManager;
(function (JudoCoachManager) {
    'use strict';

    var HomeCtrl = (function () {
        function HomeCtrl($scope) {
            var _this = this;
            this.$scope = $scope;
            this.newElem = false;
            this.list = [];
            this.form = { name: "", created: new Date() };
            this.encode = function () {
                var data = {
                    "id": 0,
                    "name": _this.form.name
                };

                _this.list.push(data);
                //Competition.addOne(data, form.created).then(function (data) {
                //		$location.path('#/app/competition/' + data.insertId);
                //	}, function (msg) { alert(msg); });
            };
            this.update = function (item) {
                //Competition.update(item);
            };
            this.remove = function (item) {
                //$scope.list.splice($scope.list.indexOf(item), 1);
                //Competition.remove(item);
            };
            $scope.vm = this;
        }
        HomeCtrl.$inject = [
            '$scope'
        ];
        return HomeCtrl;
    })();
    JudoCoachManager.HomeCtrl = HomeCtrl;
})(JudoCoachManager || (JudoCoachManager = {}));
//# sourceMappingURL=HomeCtrl.js.map
