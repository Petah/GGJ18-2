const Ui = require('./ui');

module.exports = class GameUi extends Ui {
    constructor(game) {
        super(game, 'game');
        this.html = 'Game';
    }
}
