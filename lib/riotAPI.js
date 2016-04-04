var request = require('request');
var rp = require('request-promise');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';

var _baseRiotURL = 'https://na.api.pvp.net';
var _key = require(__dirname + '/tokens.js').riotKey;
var _api = '?api_key=';

/* @desc- this function queries RIOT_API for summoner ID based on summoner name
 * @param- {string} name
 * @return null;
*/
function getSummonerID(name){
    var _summoner = '/api/lol/na/v1.4/summoner/by-name/';

    console.log(name);
    if(name.length <= 0){
        return null;
    }

    var requestOptions = {
        uri: _baseRiotURL + _summoner + name + _api + _key,
        transform: function(body, response){
                        if(response.statusCode === 200){
                            var result = JSON.parse(body);
                            var sumId, sumName;
                            for(var key in result){
                                sumId = result[key].id;
                                baseName = key;
                                formatName = result[key].name;
                                profileIcon = result[key].profileIconId;
                            }
                            console.log('getsummonerID: ' + sumId);
                            //create entry in summoner database
                            createSummoner(sumId, baseName, formatName, profileIcon);
                            return sumId;
                        }
                        else {
                            console.log('error finding summoner name: ' + response.statusCode);
                            return -1;
                        }
                    }
    }

    return rp(requestOptions);
}

/* @desc- this function queries RIOT_API for recent matches based on summoner ID
 * @param- {int} id
 * @return null;
*/
function getRecentMatches(id){
    var _summoner = '/api/lol/na/v1.3/game/by-summoner/' + id + '/recent';

    console.log('getRecentMatches: ' + id);
    var requestOptions = {
        uri: _baseRiotURL + _summoner + _api + _key,
        transform: function(body, response){
                        if(response.statusCode === 200){
                            var result = JSON.parse(body);
                            createMatchRecord(result.summonerId, result.games);
                            return result.summonerId;
                        }
                        else {
                            console.log('error finding summoner match: ' + response.statusCode);
                        }
                    }
    }

    return rp(requestOptions);
}

/* @desc- this function queries RIOT_API for stat summary based on summoner ID
 * @param- {int} id
 * @return null;
*/
function getSummary(id){
    var _summoner = '/api/lol/na/v1.3/stats/by-summoner/' + id + '/summary';

    console.log('getSummary: ' + id);
    var requestOptions = {
        uri: _baseRiotURL + _summoner + _api + _key,
        transform: function(body, response){
                        if(response.statusCode === 200){
                            var result = JSON.parse(body);
                            var summaries = result.playerStatSummaries;
                            var id = result.summonerId;
                            var aramSummary = null;
                            if(summaries){
                                for(var i=0, sLength=summaries.length; i<sLength; i++){
                                    if(summaries[i].playerStatSummaryType === 'AramUnranked5x5'){
                                        aramSummary = summaries[i];
                                        break;
                                    }
                                }

                                if(aramSummary){
                                    upsertSummary(id, aramSummary);
                                }
                            }

                            return id;
                        }
                        else {
                            console.log('error finding summoner aram summary: ' + response.statusCode);
                        }
                    }
    }

    return rp(requestOptions);
}

/*  @desc: helper function - saves summoner ID and name into postgres database
 *  @param: {int} id, {string} name
 *  @output: null
*/
function createSummoner(id, baseName, formatName, profileIcon){

    console.log('creating summoner: ' + id + ' ' + baseName);
    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error connecting DB from createSummoner');
            done();
        }
        else {
            var queryString = "INSERT INTO summoner (summoner_id, base_name, format_name, profile_icon) VALUES (" +
                id + ", '" + baseName + "', '" + formatName + "', " + profileIcon + ")";
            client.query(queryString, function(err, result){
                if(err){
                    console.log('error querying DB from createSummoner');
                }
                done();
            });
        }
    });
}

/*  @desc: helper function - saves summoner ID match info into postgres database
 *  @param: {int} summonerID, {array} matches
 *  @output: null
*/
function createMatchRecord(summonerID, matches){
    console.log('creating match record: ' + summonerID);
    var queryString = '';
    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error connecting to DB from createMatchRecord');
            done();
        }
        else {
            //loop through each match data and save to database
            for(var i=0, mLength=matches.length; i<mLength; i++){

                if(matches[i]  && matches[i].gameMode === 'ARAM'){
                    //INSERT match data into database, DO NOTHING if record already exists
                    queryString = "INSERT INTO game (summoner_id, game_id, create_date, time_played, champion_id, summoner_spell_1, summoner_spell_2, item_0, item_1, item_2, item_3, item_4, item_5, item_6, minion_kills, level, champions_killed, num_deaths, assists, total_dmg_dealt, total_dmg_dealt_champion, total_dmg_taken, total_heal, gold_earned, largest_multi_kill, largest_killing_spree) VALUES (" + summonerID  + ", " + matches[i].gameId + ", " + matches[i].createDate + ", " + matches[i].stats.timePlayed + ", " + matches[i].championId + ", " + matches[i].spell1 + ", " + matches[i].spell2 + ", " + checkUndefined(matches[i].stats.item0) + ", " + checkUndefined(matches[i].stats.item1) + ", " + checkUndefined(matches[i].stats.item2) + ", " + checkUndefined(matches[i].stats.item3) + ", " + checkUndefined(matches[i].stats.item4) + ", " + checkUndefined(matches[i].stats.item5) + ", " + checkUndefined(matches[i].stats.item6) + ", " + checkUndefined(matches[i].stats.minionsKilled) + ", " + matches[i].level + ", " + checkUndefined(matches[i].stats.championsKilled) + ", " + checkUndefined(matches[i].stats.numDeaths) + ", " + checkUndefined(matches[i].stats.assists) + ", " + checkUndefined(matches[i].stats.totalDamageDealt) + ", " + checkUndefined(matches[i].stats.totalDamageDealtToChampions) + ", " + checkUndefined(matches[i].stats.totalDamageTaken) + ", " + checkUndefined(matches[i].stats.totalHeal) + ", " + checkUndefined(matches[i].stats.goldEarned) + ", " + checkUndefined(matches[i].stats.largestMultiKill) + ", " + checkUndefined(matches[i].stats.largestKillingSpree) + ")" + " ON CONFLICT DO NOTHING";
                    client.query(queryString, function(err, result){
                        if(err){
                            console.log('error querying DB from createMatchRecord');
                        }
                        done();
                    });
                }
            }
        }
    });
}


function checkUndefined(field){ return field ? field : 'NULL';}

/*  @desc: helper function - executes an upsert for summoner ARAM summary into postgres database
 *  @param: {int} summonerID, {object} summary
 *  @output: null
*/
function upsertSummary(summonerID, summary){
    console.log('creating summary for: ' + summonerID);
    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error connecting to DB from upsertSummary');
            done();
        }
        else {
            //UPSERT summary data into database
            queryString = "INSERT INTO summary (summoner_id, total_kills, total_assists, total_turrets, wins) " +
                "VALUES (" + summonerID + ", " + summary.aggregatedStats.totalChampionKills + ", " +
                summary.aggregatedStats.totalAssists + ", " + summary.aggregatedStats.totalTurretsKilled +
                ", " + summary.wins + ")" + " ON CONFLICT (summoner_id) DO UPDATE" +
                " SET total_kills = EXCLUDED.total_kills, total_assists = EXCLUDED.total_assists, total_turrets = EXCLUDED.total_turrets, wins = EXCLUDED.wins";

            client.query(queryString, function(err, result){
                if(err){
                    console.log('error querying DB from upsertSummary');
                }
                done();
            });
        }
    });
}

//Gets list of all champion infos from RIOT API
function getChampions(){
    var _summoner = "/api/lol/static-data/na/v1.2/champion";
    var requestOptions = {
        uri: _baseRiotURL + _summoner + _api + _key,
        transform: function(body, response){
                        if(response.statusCode === 200){
                            var result = JSON.parse(body);
                            return result;
                        }
                        else {
                            console.log('error finding summoner name: ' + response.statusCode);
                            return null;
                        }
                    }
    }

    return rp(requestOptions);

}

//expose API functions
module.exports = {
    getSummonerID: getSummonerID,
    getRecentMatches: getRecentMatches,
    getSummary: getSummary,
    getChampions: getChampions
};
