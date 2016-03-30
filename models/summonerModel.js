//POSTGRES MODEL
//creates a table 'summoner' in 'riot' database
//stores the summoner ID for each summoner name
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
var client = new pg.Client(connectionString);

client.connect();

var query = client.query('CREATE TABLE summoner(id INTEGER PRIMARY KEY, name VARCHAR(24) not null)');

query.on('end', function(){ client.end; });
