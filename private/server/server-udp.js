const logger = new (require('../common/logger'))(__filename);
const dgram = require('dgram');
const Client = require('./client-udp');
const Ship = require('../game-objects/ship');

const HOST = '0.0.0.0';
const PORT = 33333;

module.exports = class Server {
    constructor(game) {
        logger.log('Create server');
        this.game = game;
        this.clients = {};
    }

    start() {
        logger.log('Start server');
        this.server = dgram.createSocket('udp4');
        this.server.on('listening', () => {
            const address = this.server.address();
            logger.log('UDP Server listening on', address.address, address.port);
        });

        this.server.on('message', (message, remote) => {
            message = JSON.parse(message);
            logger.log(remote.address, remote.port, message);

            switch (message.type) {
                case 'connect': {
                    const id = this.game.uid();
                    const client = new Client(this.game, this, id);
                    this.clients[id] = {
                        socket: dgram.createSocket('udp4'),
                        port: 33334,
                        remote: remote,
                        client: client,
                    };

                    logger.log('Client connected', id);

                    this.game.gameObjects.push(new Ship(this.game, 100, 100));

                    break;
                }
            }
        });

        this.server.bind(PORT, HOST);
    }

    stop() {
    }

    loop() {
        for (const id in this.clients) {
            if (this.clients[id].client.nextUpdate < this.game.currentTime) {
                this.clients[id].client.loop();
            }
        }
    }

    removeClient(id) {
    }

    send(clientId, type, data) {
        const message = new Buffer(JSON.stringify({
            type:type,
            data: JSON.stringify(data),
        }));
        this.clients[clientId].socket.send(message, 0, message.length, this.clients[clientId].port, this.clients[clientId].remote.address, (error, bytes) => {
            if (error) {
                logger.error(error);
                return;
            }
        });
    }
}

// console.log(remote.address + ':' + remote.port +' - ' + message);

// var message = new Buffer('My KungFu is Good!');
// client.send(message, 0, message.length, 33334, remote.address, function(err, bytes) {
//     console.log(err);
//     console.log('UDP message sent to ' + remote.address +':'+ 33334);
// });