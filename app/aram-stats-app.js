
angular.module('AramStats', [
    'ui.router'
])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('aramStats', {
                url: '',
                abstract: true
            });

        $urlRouterProvider.otherwise('/');
    })
    .controller('MainCtrl', function($scope, $http){
        $scope.name = '';
        $scope.region = 'NA';
        $scope.data = {};
        $scope.summary = {};

        var socket = io();

        socket.on('found recent matches', function(result){
            console.log(result);
        });

        socket.on('return summary stat', function(stat){
            console.log(stat);
            $scope.summary = stat;
        })

        $scope.getStats = function(name){
            socket.emit('get summoner', name);
        }
    });
