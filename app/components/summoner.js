angular.module('aramStats.components.summoner', [
    'aramStats.models.summonerStats'
])
    .config(function($stateProvider){
        $stateProvider
            .state('aramStats.main.summoner', {
                url: '^/summoner/:name',
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
    .controller('SummonerCtrl', function SummonerCtrl($stateParams, $scope, summonerStatsModel){
        var summonerCtrl = this;

        //sets the current view's model based on parent scope's stats object
        summonerCtrl.stats = $scope.stats[$stateParams.name];
        summonerCtrl.profileSrc = '';
        summonerCtrl.mostKillChampionClass = '';
        summonerCtrl.topThreeKDAClass = [];
        summonerCtrl.highestKillingSpreeClass = '';
        summonerCtrl.highestDmgDealtClass = '';
        summonerCtrl.highestDmgTakenClass = '';
        summonerCtrl.highestHealClass = '';
        summonerCtrl.highestGoldEarnedClass = '';
        summonerCtrl.highestDeathsClass = '';
        summonerCtrl.highestMinionKillsClass = '';
        processSummonerStats(summonerCtrl.stats);

        function processSummonerStats(stats){
            if(stats.summary){
                summonerCtrl.profileSrc = setProfileSrc(stats.summary.profile_icon);
            }
            if(stats.mostKills){
                summonerCtrl.mostKillChampionClass = setChampionClass(stats.mostKills.champion_key);
            }
            if(stats.topThreeKDA){
                summonerCtrl.topThreeKDAClass = stats.topThreeKDA.map(function(em){
                    return setChampionClass(em.champion_key);
                });
            }
            if(stats.maxKillingSpree){
                summonerCtrl.highestKillingSpreeClass = setChampionClass(stats.maxKillingSpree.champion_key);
            }
            if(stats.maxDmgDealt){
                summonerCtrl.highestDmgDealtClass = setChampionClass(stats.maxDmgDealt.champion_key);
            }
            if(stats.maxDmgTaken){
                summonerCtrl.highestDmgTakenClass = setChampionClass(stats.maxDmgTaken.champion_key);
            }
            if(stats.maxHeal){
                summonerCtrl.highestHealClass = setChampionClass(stats.maxHeal.champion_key);
            }
            if(stats.maxGold){
                summonerCtrl.highestGoldEarnedClass = setChampionClass(stats.maxGold.champion_key);
            }
            if(stats.maxDeaths){
                summonerCtrl.highestDeathsClass = setChampionClass(stats.maxDeaths.champion_key);
            }
            if(stats.maxMinionKills){
                summonerCtrl.highestMinionKillsClass = setChampionClass(stats.maxMinionKills.champion_key);
            }
        }

        //helper functions to append image class for image sprites
        function setProfileSrc(num){ return '/app/assets/images/profileicon/' + num + '.png'; }
        function setItemClass(num){ return 'item-' + num; }
        function setSpellClass(name){ return 'spell-' + name; }
        function setChampionClass(name){ return 'champion-' + name; }

    });
