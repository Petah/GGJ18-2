const MoveableGameObject = require('./movable-game-object');

module.exports = class Ship extends MoveableGameObject {
    constructor(game, x, y) {
        super(game, x, y);
        this.sprite = 1;
    }
}
