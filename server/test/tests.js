const io = require('socket.io-client');
const assert = require('assert');
const expect = require('chai').expect;
const scom = require('./../dist/index.js');
const databaseUtils = require('./databaseUtils.js');
const ServerConstants = require('./../dist/ServerConstants.js');

describe('Suite of unit tests', function() {
    this.timeout(10000);

    var socket, socket1;
    var config = {
        log_level : "debug",
        port : 8001,
        base : "./dist",
        db : {
            user: 'postgres', //env var: PGUSER
            database: 'tictactoe', //env var: PGDATABASE
            password: 'postgres', //env var: PGPASSWORD
            host: 'localhost', // Server hosting the postgres database
            port: 5433, //env var: PGPORT
            max: 10, // max number of clients in the pool
            idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
        }
    };

    var options ={
        transports: ['websocket'],
        'force new connection': true
    };

    before(function() {
        scom.default.start(config);
    });

    after(function() {
        scom.default.stop();
    });

    beforeEach(function(done) {
        // Setup
        socket = io.connect('http://localhost:' + config.port, options);

        socket.on('connect', function() {
            console.log('worked...');
            socket1 = io.connect('http://localhost:' + config.port, options);
            socket1.on('connect', function() {
                console.log('worked...');
                done();
            });
        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        })

    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

    describe('Tic tac toe', function() {

        it('Login', function(done) {
            socket.on(ServerConstants.login, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.token).to.exist;
                expect(response.error).to.not.exist;
                done();
            });
            var data = {
                'user' : 'jsoto',
                'password' : 'jsoto'
            }
            databaseUtils.createTables(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.login, data);
            });
        });

        it('Games', function(done) {
            socket.on(ServerConstants.games, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.games).to.exist;
                done();
            });
            var data = {
                'token' : 'jsoto',
            }
            databaseUtils.createTables(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.games, data);
            });
        });

        it('Games details', function(done) {
            socket.on(ServerConstants.game_details, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.game).to.exist;
                expect(response.details).to.exist;
                done();
            });
            var data = {
                'token' : 'jsoto',
                'game_id' : 1
            }
            databaseUtils.createTables(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.game_details, data);
            });
        });

        it('Play game', function(done) {

            var socket2 = io.connect('http://localhost:' + config.port, options);
            var count = 2
            var token
            socket.on(ServerConstants.play_game, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.game_update).to.exist;
                expect(response.details_update).to.exist;
                count--
                if(count == 0)
                    done();
            });
            socket1.on(ServerConstants.play_game, function(response){
                console.log('yeahhhhh on socket one' + JSON.stringify(response));
                expect(response.game_update).to.exist;
                expect(response.details_update).to.exist;
                count--
                if(count == 0)
                    done();
            });
            socket2.on(ServerConstants.login, function(response){
                console.log('NEVER CALLED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                throw 'error'
            });
            socket1.on(ServerConstants.games, function(response){
                console.log('Login ' + JSON.stringify(response));
                var data = {
                    'token' : 'ach',
                }
                socket2.emit(ServerConstants.games, data);
            });
            socket2.on(ServerConstants.games, function(response){
                console.log('Login One' + JSON.stringify(response));
                var data = {
                    'token' : 'jsoto',
                    'game_id' : 1,
                    'row_id' : 3,
                    'column_id' : 1
                };
                socket.emit(ServerConstants.play_game, data)
            });
            socket.on(ServerConstants.games, function(response){
                console.log('Login ' + JSON.stringify(response));
                var data = {
                    'token' : 'rparent',
                }
                socket1.emit(ServerConstants.games, data);
            });

            databaseUtils.createTables(function(){
                var data = {
                    'token' : 'jsoto',
                }
                socket.emit(ServerConstants.games, data);
            });
        });

        it('Play game for vertical win', function(done) {
            socket.on(ServerConstants.play_game, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.game_update).to.exist;
                expect(response.details_update).to.exist;
                expect(response.game_update.winner).to.equal("2");
                expect(response.error).to.not.exist;
                done();
            });
            var data = {
                'token' : 'rparent',
                'game_id' : 1,
                'row_id' : 1,
                'column_id' : 3
            };
            databaseUtils.createTables(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.play_game, data);
            });
        });

        it('Play game for horizontal win', function(done) {
            socket.on(ServerConstants.play_game, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.game_update).to.exist;
                expect(response.details_update).to.exist;
                expect(response.game_update.winner).to.equal("1");
                expect(response.error).to.not.exist;
                done();
            });
            var data = {
                'token' : 'jsoto',
                'game_id' : 1,
                'row_id' : 1,
                'column_id' : 3
            };
            databaseUtils.createTables(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.play_game, data);
            });
        });

        it('Play game for diagonal one win', function(done) {
            socket.on(ServerConstants.play_game, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.game_update).to.exist;
                expect(response.details_update).to.exist;
                expect(response.game_update.winner).to.equal("1");
                expect(response.error).to.not.exist;
                done();
            });
            var data = {
                'token' : 'jsoto',
                'game_id' : 1,
                'row_id' : 3,
                'column_id' : 3
            };
            databaseUtils.createTablesVersionTwo(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.play_game, data);
            });
        });

        it('Play game for diagonal two win', function(done) {
            socket.on(ServerConstants.play_game, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.game_update).to.exist;
                expect(response.details_update).to.exist;
                expect(response.game_update.winner).to.equal("1");
                expect(response.error).to.not.exist;
                done();
            });
            var data = {
                'token' : 'jsoto',
                'game_id' : 1,
                'row_id' : 3,
                'column_id' : 1
            };
            databaseUtils.createTablesVersionTwo(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.play_game, data);
            });
        });

        it('New game', function(done) {
            socket.on(ServerConstants.new_game, function(response){
                console.log('yeahhhhh ' + JSON.stringify(response));
                expect(response.new_game).to.exist;
                expect(response.error).to.not.exist;
                done();
            });
            var data = {
                'token' : 'jsoto',
                'other_user_ids' : [1,2],
                'size' : 3,
                'name' : 'gmae_2',
                'arcade' : true,
            };
            databaseUtils.createTables(function(){
                console.log('emit' + data);
                socket.emit(ServerConstants.new_game, data);
            });
        });

        it('Insert in database', function(done) {
            databaseUtils.createTablesForDemo(function(){
              done();
            });
        });

        it('Insert new database', function(done) {
            databaseUtils.createTablesNextVersion(function(){
                done();
            });
        });
    });
});