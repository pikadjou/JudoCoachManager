module JudoCoachManager {
    'use strict';

	export class HomeCtrl {

		public newElem: boolean = false;
		public list = [];
		public form = { name : "", created : new Date() };

        public static $inject = [
            '$scope',
        ];

        constructor(
            private $scope
            ) {

			$scope.vm = this;
		}

		public encode = () => {
			var data = {
				"id": 0,
				"name": this.form.name
			}

			this.list.push(data);
        //Competition.addOne(data, form.created).then(function (data) {
		//		$location.path('#/app/competition/' + data.insertId);
		//	}, function (msg) { alert(msg); });
		}

		public update = (item) => {
			//Competition.update(item);
		}

		public remove = (item) => {
			//$scope.list.splice($scope.list.indexOf(item), 1);
			//Competition.remove(item);
		}
    }

}