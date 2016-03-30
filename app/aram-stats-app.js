
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
        $scope.invalidName = false;
        $scope.summary = {};

        var socket = io();

        socket.on('found recent matches', function(result){
            console.log(result);
        });

        socket.on('return summary stat', function(stat){
            console.log('receive summary');
            console.log(stat);
            $scope.invalidName = false;
            $scope.summary = stat;
        });

        socket.on('summoner not found', function(){
            console.log('summoner not found');
            $scope.invalidName = true;
        });

        $scope.getStats = function(name){
            socket.emit('get summoner', name);
        }
    });
