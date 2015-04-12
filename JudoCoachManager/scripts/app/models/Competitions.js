var JudoCoachManager;
(function (JudoCoachManager) {
    (function (Models) {
        'use strict';

        var Competitions = (function () {
            function Competitions() {
                this.title = "";
                this.completed = true;
            }
            return Competitions;
        })();
        Models.Competitions = Competitions;
    })(JudoCoachManager.Models || (JudoCoachManager.Models = {}));
    var Models = JudoCoachManager.Models;
})(JudoCoachManager || (JudoCoachManager = {}));
//# sourceMappingURL=Competitions.js.map
