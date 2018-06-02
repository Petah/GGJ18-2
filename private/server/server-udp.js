const logger = new (require('../common/logger'))(__filename);
const dgram = require('dgram');

const HOST = '0.0.0.0';
const PORT = 33333;

module.exports = class Server {
    constructor(game) {
        logger.log('Create server');
        this.game = game;
    }

    start() {
        logger.log('Start server');
        this.server = dgram.createSocket('udp4');
        this.server.on('listening', () => {
            const address = this.server.address();
            logger.log('UDP Server listening on ' + address.address + ":" + address.port);
        });

        this.server.on('message', (message, remote) => {
            logger.log(remote.address, remote.port, JSON.parse(message));
        });

        this.server.bind(PORT, HOST);
    }

    stop() {
    }

    loop() {
    }

    removeClient(id) {
    }

    send(type, data) {
    }
}
