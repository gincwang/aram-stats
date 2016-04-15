
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
    });
