//POSTGRES MODEL
//creates a table 'game' in 'riot' database
//stores the summoner ID for each summoner name
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
var client = new pg.Client(connectionString);

client.connect();

var query = client.query('CREATE TABLE game(summoner_id INTEGER not null, game_id INTEGER not null, data JSONB, PRIMARY KEY(summoner_id, game_id))');

query.on('end', function(){ client.end; });
