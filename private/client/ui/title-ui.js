const Ui = require('./ui');

module.exports = class TitleUi extends Ui {
    constructor(game) {
        super(game, 'title');
        this.html = '[SPACE] to join [Enter] to start';
    }
}
