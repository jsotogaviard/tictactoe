const io = require('socket.io-client');
const assert = require('assert');
const expect = require('chai').expect;
const scom = require('./../dist/index.js');
const databaseUtils = require('./databaseUtils.js');
const ServerConstants = require('./../dist/ServerConstants.js');

describe('Suite of unit tests', function() {
    this.timeout(10000);

    describe('New database', function() {

        it('Insert new database', function(done) {
            databaseUtils.createTablesNextVersion(function(){
                done();
            });
        });
    });
});