
angular.module('aramStats.models.summonerStats', [

])
    .service('summonerStatsModel', function($rootScope){
        var model = this,
            summonerStats = {};

        model.getStats = function(){
            return summonerStats;
        };

        model.setStats = function(stats){
            summonerStats = stats;
        }
    });
