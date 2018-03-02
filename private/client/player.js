module.exports = class Player {
    constructor(game) {
        this.game = game;
        this.id = this.game.uid();
        this.input = null;

        this.game.client.send('createPlayer', {
            id: this.id,
        });
    }

    loop() {
        this.input.loop();
    }
}
