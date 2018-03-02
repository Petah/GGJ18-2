const Keyboard = class {
    constructor(game, player, gamepadIndex) {
        this.game = game;
        this.player = player;
        this.gamepadIndex = gamepadIndex;
    }

    loop() {
        let verticalAxis = 0;
        let horizontalAxis = 0;
        if (Keyboard.buttons[Keyboard.UP]) {
            verticalAxis = -1;
        } else if (Keyboard.buttons[Keyboard.DOWN]) {
            verticalAxis = 1;
        }
        if (Keyboard.buttons[Keyboard.LEFT]) {
            horizontalAxis = -1;
        } else if (Keyboard.buttons[Keyboard.RIGHT]) {
            horizontalAxis = 1;
        }

        // Tab
        let switchUnit = false;
        if (Keyboard.buttons[Keyboard.TAB]) {
            switchUnit = true;
        }

        this.game.client.send('updateInput', {
            id: this.player.id,
            move: {
                x: horizontalAxis,
                y: verticalAxis,
            },
            shoot: Keyboard.buttons[Keyboard.SPACE],
            switchUnit: switchUnit,
        });
    }
}

Keyboard.buttons = {};
Keyboard.ENTER = 13;
Keyboard.UP = 38;
Keyboard.DOWN = 40;
Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.SPACE = 32;
Keyboard.TAB = 9;

document.addEventListener('keydown', (event) => {
    Keyboard.buttons[event.which] = true;
    if (!event.ctrlKey && event.which < 122) {
        event.preventDefault();
    }
});

document.addEventListener('keyup', (event) => {
    Keyboard.buttons[event.which] = false;
    if (!event.ctrlKey && event.which < 122) {
        event.preventDefault();
    }
});

module.exports = Keyboard;