const logger = new (require('../common/logger'))(__filename);
const WebSocket = require('ws');
const Client = require('./client');

module.exports = class Server {
    constructor(game) {
        this.game = game;
        this.clients = [];
    }

    start() {
        logger.log('Server starting');

        this.server = new WebSocket.Server({
            port: 8081,
        });

        this.server.on('connection', (webSocketClient) => {
            logger.log('Server connection');
            const id = this.game.uid();
            const client = new Client(this.game, this.server, webSocketClient, id);
            this.clients.push(client);

            webSocketClient.on('close', () => {
                logger.log('Server disconnect');
                this.removeClient(id);
            });

            webSocketClient.on('error', (error) => {
                logger.log('Server error');
                this.removeClient(id);
            });
        });

        this.server.on('error', (error) => {
            logger.log('Server error', error);
        });
    }

    stop() {
        this.server.close(() => {
            logger.log('Server stopped');
        })
    }

    loop() {
        let i = this.clients.length;
        while (i--) {
            if (this.clients[i].nextUpdate < this.game.currentTime) {
                this.clients[i].loop();
            }
        }
    }

    removeClient(id) {
        this.clients = this.clients.filter(client => client.id != id);
    }

    send(type, data) {
        let i = this.clients.length;
        while (i--) {
            this.clients[i].send(type, data);
        }
    }
}
