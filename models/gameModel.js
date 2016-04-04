//POSTGRES MODEL
//creates a table 'game' in 'riot' database
//stores the summoner ID for each summoner name

function createGameModel() {
    var pg = require('pg');
    var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
    var client = new pg.Client(connectionString);

    client.connect();

    var query = client.query('CREATE TABLE IF NOT EXISTS game(summoner_id INTEGER not null, game_id INTEGER not null, PRIMARY KEY(summoner_id, game_id), create_date BIGINT not null, time_played SMALLINT not null, champion_id SMALLINT not null, summoner_spell_1 SMALLINT not null, summoner_spell_2 SMALLINT not null, item_0 SMALLINT, item_1 SMALLINT, item_2 SMALLINT, item_3 SMALLINT, item_4 SMALLINT, item_5 SMALLINT, item_6 SMALLINT, minion_kills SMALLINT, level SMALLINT not null, champions_killed SMALLINT, num_deaths SMALLINT, assists SMALLINT, total_dmg_dealt INTEGER, total_dmg_dealt_champion INTEGER, total_dmg_taken INTEGER, total_heal INTEGER, gold_earned INTEGER, largest_multi_kill SMALLINT, largest_killing_spree SMALLINT )');

    query.on('end', function(){ client.end; });
}

module.exports = {
    createGameModel: createGameModel
};
