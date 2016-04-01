//Common Queries to DB

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';


//Queries DB for relevant stats related to Summoner
//Initiated by Client side request
//Combines stats into one object to save multiple connection trips to DB
//@input  {id} Summoner ID, {io} Socket.io's connection
function getSummonerStats(id, io){
    //result object to return to client
    var output = {};
    //establish connection to DB, returning client
    pg.connect(connectionString, function(err, client, done){
        if(err){
            done();
            console.log('database connection error: ' + error);
        }
        else {
            //Go through each query to get relevant stats
            getChampionMostKills(id, output, client)
            .then(function(output){
                    console.log('back from champ kill');
                    getLongestGame(id, output, client)
                    .then(function(output){
                            console.log('back from longest game');
                            getOverallKDA(id, output, client)
                            .then(function(output){
                                    console.log('back from KDA');
                                    getTopChampionKDA(id, output, client)
                                    .then(function(output){
                                            console.log('back from Top KDA');
                                            getSummonerSummary(id, output, client)
                                            .then(function(output){
                                                console.log('back from summary');
                                                io.emit('finish result query', output);
                                            }
                                            .catch(function(reason){
                                                done();
                                            }))
                                    })
                                    .catch(function(reason){
                                        done();
                                    });
                            })
                            .catch(function(reason){
                                done();
                            });
                    })
                    .catch(function(reason){
                        done();
                    });
            })
            .catch(function(reason){
                done();
            });
        }
    });
}

//Queries DB for champion_id that has the highest champions_killed in a single game
function getChampionMostKills(id, output, client){
    console.log('get champion most kills');
    var queryStringMostKills = "SELECT champion_id, champions_killed FROM game WHERE summoner_id = " + id + " ORDER BY champions_killed DESC LIMIT 1";
    var promise = new Promise(function(resolve, reject){
        client.query(queryStringMostKills, function(err, result){
            if(err){
                console.log(err);
                reject(err);
            }
            else {
                if(result.rowCount > 0){
                    console.log(result.rows[0]);
                    output['mostKills'] = result.rows[0];
                }
                else {
                    output['mostKills'] = null;
                }
                console.log(output);
                resolve(output);
            }
        });
    });

    return promise;
}

//Queries DB for longest recorded game time
function getLongestGame(id, output, client){
    console.log('get longest game');

    var queryStringMostKills = "SELECT time_played FROM game WHERE summoner_id = " + id + " ORDER BY time_played DESC LIMIT 1";
    var promise = new Promise(function(resolve, reject){
        client.query(queryStringMostKills, function(err, result){
            if(err){
                console.log(err);
                reject(err);
            }
            else {
                if(result.rowCount > 0){
                    output['longestGame'] = result.rows[0];
                }
                else {
                    output['longestGame'] = null;
                }
                console.log(output);
                resolve(output);
            }
        });
    });

    return promise;
}


//Queries DB for overall KDA ratio ( total kills + total assists)/ total deaths
function getOverallKDA(id, output, client){
    console.log('get ARAM KDA');

    var queryStringKDA = "SELECT round((sum(champions_killed) + sum(assists))::numeric / sum(num_deaths), 2) AS kda, count(game_id) FROM game WHERE summoner_id = " + id;
    console.log(queryStringKDA);
    var promise = new Promise(function(resolve, reject){
        client.query(queryStringKDA, function(err, result){
            if(err){
                console.log(err);
                reject(err);
            }
            else {
                if(result.rowCount > 0){
                    output['kda'] = result.rows[0];
                }
                else {
                    output['kda'] = null;
                }
                console.log(output);
                resolve(output);
            }
        });
    });

    return promise;
}

//Queries DB for champion_id that with top 3 KDA ratio ( total kills + total assists)/ total deaths
function getTopChampionKDA(id, output, client){
    console.log('get highest KDA champion');

    var queryStringChampKDA = "SELECT champion_id, round((sum(champions_killed) + sum(assists))::numeric / sum(num_deaths), 2) AS kda FROM game WHERE summoner_id = " + id + "GROUP BY champion_id ORDER BY KDA DESC LIMIT 3";
    console.log(queryStringChampKDA);
    var promise = new Promise(function(resolve, reject){
        client.query(queryStringChampKDA, function(err, result){
            if(err){
                console.log(err);
                reject(err);
            }
            else {
                if(result.rowCount > 0){
                    output['topThreeKDA'] = result.rows;
                }
                else {
                    output['topThreeKDA'] = null;
                }
                console.log(output);
                resolve(output);
            }
        });
    });

    return promise;
}

function getSummonerSummary(id, output, client){
    console.log('get summoner summary');

    var queryString = "SELECT * FROM summary WHERE summoner_id = " + id;
    console.log(queryString);
    var promise = new Promise(function(resolve, reject){
        client.query(queryString, function(err, result){
            if(err){
                console.log(err);
                reject(err);
            }
            else {
                if(result.rowCount > 0){
                    output['summary'] = result.rows;
                }
                else {
                    output['summary'] = null;
                }
                console.log(output);
                resolve(output);
            }
        });
    });

    return promise;

}

module.exports = {
    getSummonerStats: getSummonerStats
};
