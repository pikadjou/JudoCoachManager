module JudoCoachManager {
    'use strict';

    export class HomeCtrl {
        public static $inject = [
            '$scope',
        ];

        constructor(
            private $scope
            ) {

            console.log("YAAATAAAAAAAAAAAAAA");
            $scope.vm = this;

        }
    }

}