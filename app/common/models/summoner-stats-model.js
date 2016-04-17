
angular.module('aramStats.models.summonerStats', [

])
    .service('summonerStatsModel', function($rootScope){
        var model = this,
            summonerStats = {};

        model.getStats = function(){
            return summonerStats;
        };

        model.replaceStats = function(stats){
            summonerStats = stats;
        };

        model.addStat = function(name, stat){
            summonerStats[name] = stat;
        }
    });
