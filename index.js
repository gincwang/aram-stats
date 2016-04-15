var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
var port = process.env.PORT || 8080;

//import database setters
var summonerSchema = require(__dirname + '/models/summonerModel.js');
var championSchema = require(__dirname + '/models/championModel.js');
var summarySchema = require(__dirname + '/models/summaryModel.js');
var gameSchema = require(__dirname + '/models/gameModel.js');

//import API/query libs
var riotSeeder = require(__dirname + '/lib/riotAPI.js');
var queries = require(__dirname + '/lib/commonQueries.js');

//create database tables
summonerSchema.createSummonerModel();
championSchema.createChampionModel();
gameSchema.createGameModel();
summarySchema.createSummaryModel();


app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/app/common/models', express.static(__dirname + '/app/common/models'));

//SPA ROUTING
//Serves only index.html
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

    //POSTGRESQL
    //main method for receiving get summoner stat request
    socket.on('get summoner', function(name){
        //make sure summoner name doesn't have any special character/spacing
        //name = name.replace(/\W/g, '').toLowerCase();
        console.log('summoner name received: ' + name);
        //connect to database pool
        pg.connect(connectionString, function(err, client, done){
            if(err){
                done();
                console.log(err);
            }

            //go out and query Riot API for latest data
            querySummoner(name, client, done);

        })
    });


    socket.on('received recent matches', function(matches){
        console.log('found matches: ' + matches);
    });

    //query database if summoner ID already exists
    //If exists, fire off request to search recent matches
    //If doesn't exist, fire off request to search for summoner ID based on name, stores it to database, then request recent matches
    function querySummoner(name, client, done){

        var queryString = "SELECT summoner_id FROM summoner WHERE  base_name='" + name + "'";
        client.query(queryString, function(err, result){
            if(err){
                console.log('error querying from querySummoner');
                done();
            }
            else {
                if(result.rowCount === 0){
                    //summoner not in database, need to fetch api
                    console.log('summoner not found in DB');
                    riotSeeder.getSummonerID(name)
                        .then(function(id){
                            console.log('rp promise: ' + id);
                            if(id !== -1){
                                //request API to get recent games associated with the summonerID
                                querySummonerMatches(id);
                            }
                        })
                        .catch(function(err){
                            console.log(err)
                            io.emit('summoner not found', err);
                        });

                }
                else {
                    var summonerID = result.rows[0].summoner_id;
                    //75% of the time, directly query summoner matches, but %25 of the time do query the summoner result once more in case user has changed summoner icon etc.
                    if(Math.random() >= 0.25){
                        //request API to get recent games associated with the summonerID
                        querySummonerMatches(summonerID);
                    }
                    else {
                        riotSeeder.getSummonerID(name)
                            .then(function(id){
                                console.log('rp promise: ' + id);
                                if(id !== -1){
                                    //request API to get recent games associated with the summonerID
                                    querySummonerMatches(id);
                                }
                            })
                            .catch(function(err){
                                console.log(err)
                                io.emit('summoner not found', err);
                            });
                    }
                }
                //close db connection
                done();
            }
        });
    }

    //Requests summoner's recent matches,
    //If successful, query summoner's stat summary
    function querySummonerMatches(summonerID){
        console.log('found summoner: ' + summonerID);
        riotSeeder.getRecentMatches(summonerID)
            .then(function(id){
                console.log(id);
                querySummonerSummary(id);
            })
            .catch(function(err){
                console.log(err);
            });
    }

    //Requests summoner's stat summary
    //If successful, send relevant data back to client
    function querySummonerSummary(summonerID){
        console.log('found matches');
        riotSeeder.getSummary(summonerID)
            .then(function(id){
                returnStats(id);
            })
            .catch(function(err){
                console.log(err);
            });
    }

    //
    function returnStats(id){
        queries.getSummonerStats(id, socket);
    }


});

http.listen(port, function(){
    console.log('Listening on port...' + port);
});
