var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';

var riotSeeder = require(__dirname + '/lib/riotAPI.js');

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/app'));


//SPA ROUTING
app.get('/*', function(req, res){
    var options = {
        root: __dirname + '/'
    };
    res.sendFile('/index.html', options);
});

//SOCKET.IO
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('get summoner', function(name){
        console.log('summoner name received: ' + name);
        pg.connect(connectionString, function(err, client, done){
            if(err){
                done();
                console.log(err);
            }
            var queryString = "SELECT id FROM summoner WHERE name='" + name + "'";
            client.query(queryString, function(err, result){
                if(err){
                    done();
                    console.log(err);
                }
                else {
                    if(result.rowCount === 0){
                        //summoner not in database, need to fetch api
                        console.log('summoner not found in DB');
                        riotSeeder.getSummonerID(name)
                            .then(function(id){
                                console.log('rp promise: ' + id);
                                querySummonerMatches(id);
                            });
                    }
                    else {
                        var summonerID = result.rows[0].id;
                        //request API to get recent games associated with the summonerID
                        querySummonerMatches(summonerID);
                    }
                    done();
                }
            }.bind(this));
        })
    });


    socket.on('received recent matches', function(matches){
        console.log('found matches: ' + matches);
    });

});

function querySummonerMatches(summonerID){
    console.log('found summoner: ' + summonerID);
    riotSeeder.getRecentMatches(summonerID)
        .then(function(id){
            console.log(id);
            querySummonerSummary(id);
        });
}

function querySummonerSummary(summonerID){
    console.log('found matches');
    riotSeeder.getSummary(summonerID)
        .then(function(id){
            returnStats(id);
        });
}

function returnStats(id){
    var stats = {};
    pg.connect(connectionString, function(err, client, done){
        if(err){
            done();
            console.log(err);
        }
        else {
            var queryString = "SELECT total_kills, wins FROM summary WHERE summoner_id = " + id;
            client.query(queryString, function(err, result){
                if(err){
                    console.log(err);
                }
                else {
                    console.log(result);
                    if(result.rowCount > 0){
                        io.emit('return summary stat', result.rows[0]);    
                    }
                }
                done();
            })
        }
    });
}

http.listen(8080, function(){
    console.log('Listening on port 8080');
});
