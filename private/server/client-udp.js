const logger = new (require('../common/logger'))(__filename);
const Player = require('./player');
const GameMath = require('../common/game-math');

module.exports = class Client {
    constructor(game, server, id) {
        this.game = game;
        this.server = server;
        this.id = id;
        this.nextUpdate = 0;
    }

    loop() {
        this.server.send(this.id, 'update', {
            gameObjects: this.game.gameObjects.map((gameObject) => {
                return {
                    id: gameObject.id,
                    // x: gameObject.x,
                    // y: gameObject.y,
                    x: 10 * Math.random(),
                    y: 10 * Math.random(),
                };
            }),
        });
    }
}
