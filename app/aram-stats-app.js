
angular.module('aramStats', [
        'ui.router',
        'aramStats.components.nav',
        'aramStats.components.summoner'
    ])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('aramStats', {
                url: '',
                abstract: true
            });

        $urlRouterProvider.otherwise('/');
    });
