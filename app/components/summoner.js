angular.module('aramStats.components.summoner', [
    'aramStats.models.summonerStats'
])
    .config(function($stateProvider){
        $stateProvider
            .state('aramStats.main.summoner', {
                url: '/summoner/:name',
                views: {
                    'summoner@': {
                        controller: 'SummonerCtrl as summonerCtrl',
                        templateUrl: 'app/components/summoner.tmpl.html'
                    }
                },
                params: {
                    data: null
                }
            });
    })
    .controller('SummonerCtrl', function SummonerCtrl($stateParams){
        var summonerCtrl = this;
        summonerCtrl.profileClass = '';
        summonerCtrl.mostKillChampionClass = '';
        summonerCtrl.topThreeKDAClass = [];
        summonerCtrl.stats = $stateParams.data;
        processSummonerStats(summonerCtrl.stats);

        function processSummonerStats(stats){
            if(stats.summary){
                summonerCtrl.profileClass = setProfileClass(stats.summary.profile_icon);
            }
            if(stats.mostKills){
                summonerCtrl.mostKillChampionClass = setChampionClass(stats.mostKills.champion_key);
            }
            if(stats.topThreeKDA){
                summonerCtrl.topThreeKDAClass = stats.topThreeKDA.map(function(em){
                    return setChampionClass(em.champion_key);
                });
            }
        }

        //helper functions to append image class for image sprites
        function setProfileClass(num){ return 'profileicon-' + num; }
        function setItemClass(num){ return 'item-' + num; }
        function setSpellClass(name){ return 'spell-' + name; }
        function setChampionClass(name){ return 'champion-' + name; }

    });
