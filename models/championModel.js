//POSTGRES MODEL
//creates a table 'champion' in 'riot' database
//stores the champion info for each champion id
function createChampionModel(){
    var pg = require('pg');
    var riotSeeder = require('../lib/riotAPI.js');
    var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/riot';
    var client = new pg.Client(connectionString);

    client.connect();
    console.log('creating champion model');

    //Creates champion table in database
    createTable(client);

    //Queries Riot API for latest champion Info
    populateChampionData(client);


    function createTable(client){
        client.query('CREATE TABLE IF NOT EXISTS champion(champion_id SMALLINT primary key, champion_title VARCHAR(50) not null, champion_name VARCHAR(50) not null, champion_key VARCHAR(50) not null)', function(err, result){
            if(err){
                client.end;
            }
        });
    }

    function populateChampionData(client){
        riotSeeder.getChampions()
            .then(function(result){
                var champion_id, title, name, key, queryString;
                for(var champKey in result.data){
                    champion_id = result.data[champKey].id;
                    title = result.data[champKey].title;
                    name = result.data[champKey].name;
                    key = result.data[champKey].key;
                    queryString = "INSERT INTO champion (champion_id, title, name, key) VALUES (" + champion_id + ", $$" + title + "$$, $$" + name + "$$, $$" + key + "$$) ON CONFLICT (champion_id) DO NOTHING";
                    console.log(queryString);
                    client.query(queryString, function(err){
                        if(err){console.log(err); client.end;}
                    });
                }
            })
            .catch(function(reason){
                console.log('error: ' + reason);
            });
    }
}

module.exports = {
    createChampionModel: createChampionModel
};
