var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';

function getSummonerStats(id, io){
    var output = {};
    pg.connect(connectionString, function(err, client, done){
        if(err){
            done();
            console.log(err);
        }
        else {
            getChampionMostKills(id, output, client)
                .then(function(output){
                    console.log('back from champ kill');
                    getLongestGame(id, output, client)
                        .then(function(output){
                            console.log('back from longest game');
                            getOverallKDA(id, output, client)
                                .then(function(output){
                                    console.log('back from KDA');
                                    console.log(output);
                                    getTopChampionKDA(id, output, client)
                                        .then(function(output){
                                            console.log('back from Top KDA');
                                            console.log(output);
                                            io.emit('finish result query', output);
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


function getChampionMostKills(id, output, client){
    console.log('get champion most kills');
    console.log(output);
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
                    resolve(output);
                }
            }
        });
    });

    return promise;
}


function getLongestGame(id, output, client){
    console.log('get longest game');
    console.log(output);

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
                    resolve(output);
                }
            }
        });
    });

    return promise;
}

function getOverallKDA(id, output, client){
    console.log('get ARAM KDA');
    console.log(output);

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
                    resolve(output);
                }
            }
        });
    });

    return promise;
}


function getTopChampionKDA(id, output, client){
    console.log('get highest KDA champion');
    console.log(output);

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
                    resolve(output);
                }
            }
        });
    });

    return promise;
}

module.exports = {
    getSummonerStats: getSummonerStats
};
