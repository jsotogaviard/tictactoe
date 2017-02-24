import winston from "winston";
import pg from "pg";
import * as ServerConstants from "./ServerConstants";

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

// TODO Pre thing verify that all tokens are valid

class SnapCarServer {

    constructor(io, config){
        // Keep the data in memory
        this.config = config
        this.io = io
        this.pool = new pg.Pool(this.config.db);
        this.bindedExec = this.exec.bind(this)
        this.pool.on('error', (err, client) => {
            // if an error is encountered by a client while it sits idle in the pool
            // the pool itself will emit an error event with both the error and
            // the client which emitted the original error
            // this is a rare occurrence but can happen if there is a network partition
            // between your application and the database, the database restarts, etc.
            // and so you might want to handle it and at least log it out
            winston.error('idle client error', err.message, err.stack)
        })
        winston.info("pool" + this.pool)
    }

    start(){
        winston.info('Starting snapcar server')
    }

    stop(){
        winston.info('stop snapcar server')
    }

    disconnect(socket){
        winston.info('Disconnecting socket ' + socket.id)
    }

    map(data){
        let result = {}
        for(let idx in data){
            let entry = data[idx]
            result[entry.id] = entry
        }
        return result
    }

    exec(query, values, callback){
        this.pool.connect((err, client, done) => {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(query, values, (err, result)  => {
                if (err) {
                    winston.error('Error :' + query, err);
                } else {
                    winston.log('Done : ' + query);
                }
                done();
                callback(result);
            });
        });
    }

    static generateToken() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( let i=0; i < 17; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        winston.info("[token]", text)
        return text;
    }

    login(data, callback){
        winston.info("[login]", data)
        let exec = this.exec.bind(this)
        this.bindedExec(
            'SELECT id FROM TICTACTOE.T_USERS WHERE LOGIN = $1::text AND PASSWORD = $2::text',
            [data.user, data.password],
            (result) => {
                if(result.rowCount == 1){

                    // Create token
                    // TODO make sure the token does not exist already
                    let token = SnapCarServer.generateToken();
                    let userId = result.rows[0].id
                    this.bindedExec(
                        'UPDATE TICTACTOE.T_USERS SET token = $1::text WHERE id = $2::int',
                        [token, userId],
                        function(result){
                            callback({token : token})
                        }
                    );

                } else {
                    // TODO
                    // Handle error cases
                    callback({error : 'error'})
                }
            }
        )
    }

    games(data, callback){
        winston.info("[games]", data)
        this.bindedExec(
            'SELECT * FROM TICTACTOE.T_GAME_USERS GU JOIN TICTACTOE.T_GAMES G ON GU.GAME_ID = G.ID JOIN TICTACTOE.T_USERS U ON U.ID = GU.USER_ID WHERE U.TOKEN = $1::text',
            [data.token],
            (result) => {
                winston.info("[games]", result.rows);
                callback({games : result.rows})
            }
        )
    }

    gameDetails(data, callback){
        winston.info("[game_details]", data)
        this.bindedExec(
            'SELECT * FROM TICTACTOE.T_GAME_DETAILS GD WHERE GD.GAME_ID = $1::int',
            [data.game_id],
            (gamesDetailsResult) => {
                this.bindedExec(
                    'SELECT * FROM TICTACTOE.T_GAMES G WHERE G.ID = $1::int',
                    [data.game_id],
                    (gamesResult) => {
                        callback({
                                details: gamesDetailsResult.rows,
                                game : gamesResult.rows[0]
                            }
                        )
                    }
                )
            }
        )
    }

    checkToken(data, callback, checkUserToPlay){
        checkUserToPlay(data, callback, this.checkPosition.bind(this))
    }

    checkUserToPlay(data, callback, checkPosition){
        checkPosition(data, callback, this.insertRow.bind(this))
    }

    checkPosition(data, callback, insertRow){
        insertRow(data, callback, this.checkWinner.bind(this))
    }

    insertRow(data, callback, checkWinner){
        winston.info("[insert_row]", data)
        // Insert the game details row
        this.bindedExec(
            'INSERT INTO TICTACTOE.T_GAME_DETAILS (game_id, row_id, column_id, user_id) VALUES ($1, $2, $3, (SELECT id FROM TICTACTOE.T_USERS U WHERE U.TOKEN = $4)) RETURNING id',
            [data.game_id, data.row_id, data.column_id, data.token],
            (result) => {
                winston.info("[insert_row]", result.rows);

                // Store the game details id
                data.game_details_id = result.rows[0].id
                checkWinner(data, callback, this.changeGameStatus.bind(this))
            }
        )
    }

    checkWinner(data, callback, changeGameStatus){
        winston.info("[checkWinner]", data)
        let horizontalQuery = 'SELECT GD.USER_ID, GD.ROW_ID, G.SIZE, COUNT(*) AS HITS ' +
            'FROM TICTACTOE.T_GAME_DETAILS GD JOIN TICTACTOE.T_GAMES G ON G.ID = GD.GAME_ID ' +
            'WHERE GD.GAME_ID = $1 GROUP BY GD.USER_ID, GD.ROW_ID, G.SIZE';
        this.bindedExec(
            horizontalQuery,
            [data.game_id],
            (horizontalResult) => {

                // Compute the status of the game
                // Look for horizontal win
                for(let idx in horizontalResult.rows){
                    let horizontalRow = horizontalResult.rows[idx]
                    if(horizontalRow.hits == horizontalRow.size){
                        data.winner = horizontalRow.user_id
                        break
                    }
                }

                if(!data.winner){
                    let verticalQuery =  'SELECT GD.USER_ID, GD.COLUMN_ID, G.SIZE, COUNT(*) AS HITS ' +
                        'FROM TICTACTOE.T_GAME_DETAILS GD JOIN TICTACTOE.T_GAMES G ON G.ID = GD.GAME_ID ' +
                        'WHERE GD.GAME_ID = $1 GROUP BY GD.USER_ID, GD.COLUMN_ID, G.SIZE';
                    this.bindedExec(
                        verticalQuery,
                        [data.game_id],
                        (verticalResult) => {

                            // Compute the status of the game
                            // Look for vertical win
                            for(let idx in verticalResult.rows){
                                let verticalRow = verticalResult.rows[idx]
                                if(verticalRow.hits == verticalRow.size){
                                    data.winner = verticalRow.user_id
                                    break
                                }
                            }

                            if(!data.winner){
                                let diagOneQuery =  'SELECT GD.USER_ID, G.SIZE, COUNT(*) AS HITS ' +
                                    'FROM TICTACTOE.T_GAME_DETAILS GD JOIN TICTACTOE.T_GAMES G ON G.ID = GD.GAME_ID ' +
                                    'WHERE GD.GAME_ID = $1 AND GD.ROW_ID = GD.COLUMN_ID GROUP BY GD.USER_ID, G.SIZE';
                                this.bindedExec(
                                    diagOneQuery,
                                    [data.game_id],
                                    (diagOneResult) => {

                                        // Compute the status of the game
                                        // Look for diagonal one win
                                        for(let idx in diagOneResult.rows){
                                            let diagOneRow = diagOneResult.rows[idx]
                                            if(diagOneRow.hits == diagOneRow.size){
                                                data.winner = diagOneRow.user_id
                                                break;
                                            }
                                        }

                                        if(!data.winner ){
                                            let diagTwoQuery =  'SELECT GD.USER_ID, G.SIZE, COUNT(*) AS HITS ' +
                                                'FROM TICTACTOE.T_GAME_DETAILS GD JOIN TICTACTOE.T_GAMES G ON G.ID = GD.GAME_ID ' +
                                                'WHERE GD.GAME_ID = $1 AND GD.ROW_ID + GD.COLUMN_ID = G.SIZE + 1 GROUP BY GD.USER_ID, G.SIZE';
                                            this.bindedExec(
                                                diagTwoQuery,
                                                [data.game_id],
                                                (diagTwoResult) => {

                                                    // Compute the status of the game
                                                    // Look for diagonal one win
                                                    for(let idx in diagTwoResult.rows){
                                                        let diagTwoRow = diagTwoResult.rows[idx]
                                                        if(diagTwoRow.hits == diagTwoRow.size){
                                                            data.winner = diagTwoRow.user_id
                                                            break
                                                        }
                                                    }

                                                    changeGameStatus(data, callback, this.calculateUpdate.bind(this))
                                                }
                                            )
                                        } else {
                                            changeGameStatus(data, callback, this.calculateUpdate.bind(this))
                                        }
                                    }
                                )
                            } else {
                                changeGameStatus(data, callback, this.calculateUpdate.bind(this))
                            }
                        }
                    )
                } else {
                    changeGameStatus(data, callback, this.calculateUpdate.bind(this))
                }
            }
        )
    }

    changeGameStatus(data, callback, sendUpdate){
        winston.info("[changeGameStatus]", data)
        if(data.winner){
            this.bindedExec(
                'UPDATE TICTACTOE.T_GAMES G SET STATUS = $1::text, WINNER = $2::int WHERE G.ID = $3::int',
                [ServerConstants.done, data.winner, data.game_id],
                (gameResult) => {
                    sendUpdate(data, callback, this.sendToGameUsers.bind(this))
                }
            )
        } else {
            sendUpdate(data, callback, this.sendToGameUsers.bind(this))
        }
    }

    calculateUpdate(data, callback, sendToGameUsers){
        winston.info("[calculateUpdate]", data)
        this.bindedExec(
            'SELECT * FROM TICTACTOE.T_GAMES G WHERE G.ID = $1::int',
            [data.game_id],
            (gameResult) => {
                let game = gameResult.rows[0]
                this.bindedExec(
                    'SELECT * FROM TICTACTOE.T_GAME_DETAILS GD WHERE GD.ID = $1::int',
                    [data.game_details_id],
                    (gameDetailsResult) => {
                        let gameDetails = gameDetailsResult.rows[0]
                        data.result = {}
                        data.result.game_update = game
                        data.result.details_update = gameDetails
                        sendToGameUsers(data, callback)
                    }
                )
            }
        )
    }

    sendToGameUsers(data, callback){
        winston.info("[sendToGameUsers]", data)
        this.bindedExec(
            'SELECT * FROM TICTACTOE.T_GAME_USERS GU JOIN TICTACTOE.T_USERS U ON U.ID = GU.USER_ID WHERE GU.GAME_ID = $1::int',
            [data.game_id],
            (gameUsersResult) => {
                data.result.tokens = gameUsersResult.rows
                callback(data.result)
            }
        )
    }

    playGame(data, callback){
        winston.info("[play_game]", data)
        this.checkToken(
            data,
            callback,
            this.checkUserToPlay.bind(this)
        );
    }

    newGame(data, callback){
        winston.info("[new_game]", data)

        // TODO Get user from token
        this.bindedExec(
            'INSERT INTO TICTACTOE.T_GAMES (name, size, arcade, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [data.name, data.size, data.arcade, ServerConstants.open],
            (gameResult) => {
                let gameResultId = gameResult.rows[0].id
                let query = '';
                let values = []
                let count = 1;
                let order = 0
                for (let idx in data.other_user_ids) {
                    let other_user_id = data.other_user_ids[idx];
                    query += '($' + count++ + ', $' + count++ + ',$' + count++ + '),'
                    values = values.concat([gameResultId, other_user_id, order++])
                }
                let queryString = query.substring(0, query.length - 1);
                winston.info("[new_game] query", queryString);
                this.bindedExec(
                    'INSERT INTO TICTACTOE.T_GAME_USERS (game_id, user_id, order_id) VALUES ' + queryString,
                    values,
                    (gameUsersResult) => {
                        data.result = {
                            new_game: {
                                game_id: gameResultId,
                                name: data.name,
                                size: data.size,
                                arcade: data.arcade,
                                status: ServerConstants.open
                            }
                        }
                        data.game_id = gameResultId
                        this.sendToGameUsers(data, callback)
                    }
                )
            }
        )
    }
}

export default SnapCarServer
