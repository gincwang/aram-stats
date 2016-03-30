//POSTGRES MODEL
//creates a table 'summary' in 'riot' database
//stores the summoner stats summary for aram
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
var client = new pg.Client(connectionString);

client.connect();

var query = client.query('CREATE TABLE summary(summoner_id INTEGER primary key, total_kills INTEGER, total_assists INTEGER, total_turrets INTEGER, wins INTEGER)');

query.on('end', function(){ client.end; });
