const logger = new (require('../common/logger'))(__filename);

module.exports = class Team {
    constructor(
        game,
        id,
    ) {
        this.game = game;
        this.id = id;
        this.name = null;
        this.players = [];
        this.units = [];
    }

    addPlayer(player) {
        logger.log('Add player');
        this.players.push(player);
        this.game.gameObjects.push(player);
    }

    loop() {

    }
}
