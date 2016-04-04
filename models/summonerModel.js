//POSTGRES MODEL
//creates a table 'summoner' in 'riot' database
//stores the summoner ID for each summoner name
function createSummonerModel(){
    var pg = require('pg');
    pg.defaults.ssl = true;
    var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
    var client = new pg.Client(connectionString);

    client.connect();

    var query = client.query('CREATE TABLE IF NOT EXISTS summoner(summoner_id INTEGER PRIMARY KEY, base_name VARCHAR(24) not null, format_name VARCHAR(24) not null, profile_icon INTEGER not null)');

    query.on('end', function(){ client.end; });

}

module.exports = {
    createSummonerModel: createSummonerModel
};
