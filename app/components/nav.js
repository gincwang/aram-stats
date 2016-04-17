angular.module('aramStats.components.nav', [
    'aramStats.components.summoner'
])
    .config(function($stateProvider){
        $stateProvider
            .state('aramStats.main', {
                url: '/',
                views: {
                    'nav@': {
                        controller: 'NavCtrl as navCtrl',
                        templateUrl: 'app/components/nav.tmpl.html'
                    }
                }
            });
    })
    .controller('NavCtrl', function NavCtrl($state){
        var navCtrl = this;
        navCtrl.summonerName = '';

        //Fires off socket event to grab summoner's stats from server
        navCtrl.getSummonerStats = function(name){
            name = name.replace(/\W/g, '').toLowerCase();
            socket.emit('get summoner', name);
        }

    });
