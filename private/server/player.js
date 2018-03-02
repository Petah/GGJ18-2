const Ship = require('../game-objects/ship');

module.exports = class Player {
    constructor(game, id) {
        this.game = game;
        this.id = id;
        this.unit = new Ship(this.game, 100, 100);
        this.game.gameObjects.push(this.unit);
    }

    loop() {

    }
}
