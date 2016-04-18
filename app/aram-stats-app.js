
angular.module('aramStats', [
        'ui.router',
        'aramStats.components.nav',
        'aramStats.components.summoner'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider){
        $stateProvider
            .state('aramStats', {
                url: '',
                abstract: true
            });

        $urlRouterProvider.otherwise('/');

        //use HTML5 History API
        $locationProvider.html5Mode(true);
    })
    .controller('MainCtrl', function MainCtrl($state, $scope, summonerStatsModel){
        $scope.stats = summonerStatsModel.getStats();

        //Receives data returned from server,
        //Only go to new path after summoner data is returned
        socket.on('finish result query', function(stat){
            var summonerName = stat.summary.base_name;
            summonerStatsModel.addStat(summonerName, stat);
            $state.go('aramStats.main.summoner', {name: summonerName});
        })
    })
    .directive('scroll', function($window){
        return function(scope, element, attrs){
            angular.element($window).bind('scroll', function(){
                var navBarBreakPoint = 100;
                if(this.pageYOffset < navBarBreakPoint){
                    angular.element('.navStyle').removeClass('minify');
                }
                else if(this.pageYOffset >= navBarBreakPoint){
                    angular.element('.navStyle').addClass('minify');
                }
                scope.$apply();
            });
        };
    });
