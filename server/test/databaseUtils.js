
const pg = require('pg');
var poolconfig = {
    user: 'postgres', //env var: PGUSER
    database: 'tictactoe', //env var: PGDATABASE
    password: 'postgres', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5433, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(poolconfig);

function exec(query, callback){
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(query, function (err, result) {
            if (err) {
                console.error('error ' + query, err);
            } else {
                console.log('Query done ' + query, err);
            }
            done();
            callback();
        });
    });
}
module.exports = {
    createTables: function (callback) {
        // TODO add constraints
        exec(
            'DROP SCHEMA IF EXISTS TICTACTOE CASCADE;CREATE SCHEMA TICTACTOE;GRANT ALL ON SCHEMA TICTACTOE TO postgres;' +
            'CREATE TABLE TICTACTOE.T_USERS ( id SERIAL NOT NULL PRIMARY KEY, login VARCHAR(18) NOT NULL,PASSWORD VARCHAR(18) NOT NULL, TOKEN VARCHAR(18), end_date TIMESTAMP WITH TIME ZONE);' +
            'INSERT INTO TICTACTOE.T_USERS (login, password, token ) VALUES (\'jsoto\', \'jsoto\', \'jsoto\'), (\'rparent\', \'rparent\', \'rparent\'), (\'ach\', \'ach\', \'ach\');' +
            'CREATE TABLE TICTACTOE.T_GAMES ( id SERIAL NOT NULL PRIMARY KEY, name VARCHAR(18) NOT NULL, arcade BOOLEAN NOT NULL, size BIGINT, winner BIGINT, status VARCHAR(18) );' +
            'INSERT INTO TICTACTOE.T_GAMES (name, arcade, size, status ) VALUES (\'game_1\', \'true\', 3, \'open\');' +
            'CREATE TABLE TICTACTOE.T_GAME_USERS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, order_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_USERS (game_id, user_id, order_id ) VALUES (1, 1, 1), (1, 2, 2);' +
            'CREATE TABLE TICTACTOE.T_GAME_DETAILS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, row_id BIGINT NOT NULL, column_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_DETAILS (game_id, user_id, row_id, column_id ) VALUES (1, 1, 1, 1), (1, 1, 2, 2), (1, 2, 3, 3), (1, 2, 2, 3), (1, 1, 1, 2)'
        ,callback
        )
    },
    createTablesVersionTwo: function (callback) {
        // TODO add constraints
        exec(
            'DROP SCHEMA IF EXISTS TICTACTOE CASCADE;CREATE SCHEMA TICTACTOE;GRANT ALL ON SCHEMA TICTACTOE TO postgres;' +
            'CREATE TABLE TICTACTOE.T_USERS ( id SERIAL NOT NULL PRIMARY KEY, login VARCHAR(18) NOT NULL,PASSWORD VARCHAR(18) NOT NULL, TOKEN VARCHAR(18), end_date TIMESTAMP WITH TIME ZONE);' +
            'INSERT INTO TICTACTOE.T_USERS (login, password, token ) VALUES (\'jsoto\', \'jsoto\', \'jsoto\'), (\'rparent\', \'rparent\', \'rparent\'), (\'ach\', \'ach\', \'ach\');' +
            'CREATE TABLE TICTACTOE.T_GAMES ( id SERIAL NOT NULL PRIMARY KEY, name VARCHAR(18) NOT NULL, arcade BOOLEAN NOT NULL, size BIGINT, winner BIGINT, status VARCHAR(18) );' +
            'INSERT INTO TICTACTOE.T_GAMES (name, arcade, size, status ) VALUES (\'game_1\', \'true\', 3, \'open\');' +
            'CREATE TABLE TICTACTOE.T_GAME_USERS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, order_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_USERS (game_id, user_id, order_id ) VALUES (1, 1, 1), (1, 2, 2);' +
            'CREATE TABLE TICTACTOE.T_GAME_DETAILS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, row_id BIGINT NOT NULL, column_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_DETAILS (game_id, user_id, row_id, column_id ) VALUES (1, 1, 1, 1), (1, 1, 2, 2), (1, 1, 1, 3)'
            ,callback
        )
    },
    createTablesForDemo: function (callback) {
        // TODO add constraints
        exec(
            'DROP SCHEMA IF EXISTS TICTACTOE CASCADE;CREATE SCHEMA TICTACTOE;GRANT ALL ON SCHEMA TICTACTOE TO postgres;' +
            'CREATE TABLE TICTACTOE.T_USERS ( id SERIAL NOT NULL PRIMARY KEY, login VARCHAR(18) NOT NULL,PASSWORD VARCHAR(18) NOT NULL, TOKEN VARCHAR(18), end_date TIMESTAMP WITH TIME ZONE);' +
            'INSERT INTO TICTACTOE.T_USERS (login, password, token ) VALUES (\'jsoto\', \'jsoto\', \'jsoto\'), (\'rparent\', \'rparent\', \'rparent\'), (\'ach\', \'ach\', \'ach\');' +
            'CREATE TABLE TICTACTOE.T_GAMES ( id SERIAL NOT NULL PRIMARY KEY, name VARCHAR(18) NOT NULL, arcade BOOLEAN NOT NULL, size BIGINT, winner BIGINT, status VARCHAR(18) );' +
            'INSERT INTO TICTACTOE.T_GAMES (name, arcade, size, status ) VALUES (\'game_1\', \'false\', 3, \'open\'), (\'game_2\', \'false\', 5, \'open\'), (\'game_3\', \'false\', 4, \'open\');' +
            'CREATE TABLE TICTACTOE.T_GAME_USERS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, order_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_USERS (game_id, user_id, order_id ) VALUES (1, 1, 1), (1, 3, 2), (2, 2, 1), (2, 3, 2), (3, 1, 1), (3, 2, 2);' +
            'CREATE TABLE TICTACTOE.T_GAME_DETAILS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, row_id BIGINT NOT NULL, column_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_DETAILS (game_id, user_id, row_id, column_id ) VALUES (1, 1, 1, 1), (1, 1, 2, 2), (1, 2, 3, 3), (1, 2, 2, 3), (1, 1, 1, 2)'
            ,callback
        )
    },
    createTablesNextVersion: function (callback) {
        exec(
            'DROP SCHEMA IF EXISTS TICTACTOE CASCADE;CREATE SCHEMA TICTACTOE;GRANT ALL ON SCHEMA TICTACTOE TO postgres;' +

            'CREATE TABLE TICTACTOE.T_APPS (id SERIAL NOT NULL PRIMARY KEY, key_app VARCHAR(18) NOT NULL,secret_app VARCHAR(18) NOT NULL, name VARCHAR(18), description VARCHAR(18));' +
            'INSERT INTO TICTACTOE.T_APPS (key_app, secret_app, name) VALUES (\'g5452g55568\', \'545454e5454\', \'Iphone App\'), (\'774545454568\', \'55578754549\', \'Android App\'), (\'6466787854\', \'578787454\', \'JS App\');' +

            'CREATE TABLE TICTACTOE.T_TOKENS (id SERIAL NOT NULL PRIMARY KEY, user_id BIGINT NOT NULL,app_id BIGINT NOT NULL, token VARCHAR(18), created_at TIMESTAMP WITH TIME ZONE, expiration_at TIMESTAMP WITH TIME ZONE);' +

            'CREATE TABLE TICTACTOE.T_USERS ( id SERIAL NOT NULL PRIMARY KEY, login VARCHAR(18) NOT NULL,PASSWORD VARCHAR(18) NOT NULL, SALT VARCHAR(18) NOT NULL, created_at TIMESTAMP WITH TIME ZONE, language VARCHAR(18));' +
            'INSERT INTO TICTACTOE.T_USERS (login, password, salt ) VALUES (\'jsoto\', \'fidjhjh\', \'idfhh\'), (\'rparent\', \'idfhh\', \'idfhh\'), (\'ach\', \'idfhh\', \'idfhh\');' +

            'CREATE TABLE TICTACTOE.T_GAMES ( id SERIAL NOT NULL PRIMARY KEY, name VARCHAR(18) NOT NULL, arcade BOOLEAN NOT NULL, size BIGINT, winner BIGINT, status VARCHAR(18) );' +
            'INSERT INTO TICTACTOE.T_GAMES (name, arcade, size, status ) VALUES (\'game_1\', \'false\', 3, \'open\'), (\'game_2\', \'false\', 5, \'open\'), (\'game_3\', \'false\', 4, \'open\');' +

            'CREATE TABLE TICTACTOE.T_GAME_USERS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, order_id BIGINT NOT NULL );' +
            'INSERT INTO TICTACTOE.T_GAME_USERS (game_id, user_id, order_id ) VALUES (1, 1, 1), (1, 3, 2), (2, 2, 1), (2, 3, 2), (3, 1, 1), (3, 2, 2);' +

            'CREATE TABLE TICTACTOE.T_GAME_DETAILS ( id SERIAL NOT NULL PRIMARY KEY, game_id BIGINT NOT NULL, user_id BIGINT NOT NULL, row_id BIGINT NOT NULL, column_id BIGINT NOT NULL, z_id BIGINT );' +
            'INSERT INTO TICTACTOE.T_GAME_DETAILS (game_id, user_id, row_id, column_id ) VALUES (1, 1, 1, 1), (1, 1, 2, 2), (1, 2, 3, 3), (1, 2, 2, 3), (1, 1, 1, 2)'
            ,callback
        )
    }
}