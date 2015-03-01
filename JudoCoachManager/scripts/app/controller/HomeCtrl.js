var JudoCoachManager;
(function (JudoCoachManager) {
    'use strict';

    var HomeCtrl = (function () {
        function HomeCtrl($scope) {
            this.$scope = $scope;
            console.log("YAAATAAAAAAAAAAAAAA");
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
