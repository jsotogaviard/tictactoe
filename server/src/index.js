import socket from "socket.io";
import express from "express";
import winston from "winston";
import http from "http";
import SnapCarServer from './SnapCarServer'
import * as ServerConstants from "./ServerConstants";
import path from "path";

class Scom {

    constructor(){}

    start(config){
        this.config = config
        this.sockets = {}

        // If necessary override the log level
        if(this.config.log_level)
            winston.level = this.config.log_level

        const dist = path.resolve('./dist')
        winston.info("Using dist " + dist);
        this.app = express();
        this.app.use(express.static(dist));
        const nodeModules = path.resolve('./node_modules')
        this.app.use(express.static(nodeModules));

        this.server = http.createServer(this.app)
        let io = socket(this.server)

        let snapcarServerInstance = new SnapCarServer(io, this.config)

        io.sockets.on('connection', socket => {

            socket.on(ServerConstants.login, (data) => {
                winston.info('[login] ', data)
                snapcarServerInstance.login(data, (response) => {
                    winston.info('[login] response from server', response)
                    this.sockets[response.token] = socket
                    socket.emit(ServerConstants.login, response)
                })
            })

            socket.on(ServerConstants.games, (data) => {
                winston.info('[games] ', data)
                this.sockets[data.token] = socket
                snapcarServerInstance.games(data, (response) => {
                    winston.info('[games] response from server', response)
                    socket.emit(ServerConstants.games, response)
                })
            })

            socket.on(ServerConstants.game_details, (data) => {
                winston.info('[game_details] ', data)
                snapcarServerInstance.gameDetails(data, (response) => {
                    winston.info('[game_details] response from server', response)
                    socket.emit(ServerConstants.game_details, response)
                })
            })

            socket.on(ServerConstants.play_game, (data) => {
                winston.info('[play_game] ', data)
                this.sockets[data.token] = socket
                snapcarServerInstance.playGame(data, (response) => {
                    winston.info('[play_game] final response from server', response)

                    let tokens = response.tokens
                    for(let idx in tokens){
                        let token =  tokens[idx]
                        let toSocket = this.sockets[token.token]
                        if(toSocket)
                            toSocket.emit(ServerConstants.play_game, response)
                    }
                })
            })

            socket.on(ServerConstants.new_game, (data) => {
                winston.info('[new_game] ', data)
                this.sockets[data.token] = socket
                snapcarServerInstance.newGame(data, (response) => {
                    winston.info('[new_game] response from server', response)

                    let tokens = response.tokens
                    for(let idx in tokens){
                        let token =  tokens[idx]
                        let toSocket = this.sockets[token.token]
                        if(toSocket)
                            toSocket.emit(ServerConstants.new_game, response)
                    }
                })
            })

            socket.on(ServerConstants.disconnect, () => {
                // TODO Remove socket withtout token
                winston.info('disconnected ' + socket)
            })

        })

        this.server.listen(this.config.port, () => {
            console.log('Scom listening at ' + this.config.port);
        });

        const index = path.resolve('./dist/index.html')
        winston.info('dorname' + __dirname)
        this.app.get('*', (req, res) => {
            res.sendFile(index)
        });

        winston.info('start server done')

    }

    stop(){
        this.server.close()
    }
}

const instance = new Scom()
export default instance
