const Client = require('./client');
const TitleUi = require('./ui/title-ui');
const GameUi = require('./ui/game-ui');
const Keyboard = require('./input/keyboard');
const Player = require('./player');

module.exports = class Game {
    constructor() {
        this.client = new Client(this);
        this.client.connect();

        this.state = 'title';
        this.started = false;

        this.players = [];

        this.titleUi = new TitleUi(this);
        this.gameUi = new GameUi(this);

        this.nextId = 1;
    }

    start() {
        console.log('Game start');

        this.started = true;

        let lastSecond = 0;
        let previousTime = performance.now() / 1000;
        let updates = 0;
        const gameLoop = () => {
            this.currentTime = performance.now() / 1000;
            const deltaTime = this.currentTime - previousTime;
            previousTime = this.currentTime;
            updates++;

            if (lastSecond <= this.currentTime - 1) {
                lastSecond = this.currentTime;
                //console.log('UPS', updates);
                updates = 0;
            }

            this.loop(deltaTime, this.currentTime);

            if (this.started) {
                window.requestAnimationFrame(gameLoop);
            }
        };
        window.requestAnimationFrame(gameLoop);
    }

    stop() {
        console.log('Game stop');

        this.started = false;
    }

    createGamepadPlayer(gamepadIndex) {
        let found = false;
        let p = this.players.length;
        while (p--) {
            if (this.players[p].input.gamepadIndex == gamepadIndex) {
                return;
            }
        }
        console.log('Creating gamepad player');
        const player = new Player(this);
        const input = new Gamepad(this, player, gamepadIndex);
        player.input = input;
        this.players.push(player);
    }

    createKeyboardPlayer() {
        let p = this.players.length;
        while (p--) {
            if (this.players[p].keyboard) {
                return;
            }
        }
        console.log('Creating keyboard player');
        const player = new Player(this);
        const input = new Keyboard(this, player);
        player.keyboard = true;
        player.input = input;
        this.players.push(player);
    }

    loop() {
        this.gamepads = navigator.getGamepads();
        switch (this.state) {
            case 'title': {
                let i = this.gamepads.length;
                while (i--) {
                    if (this.gamepads[i]) {
                        // for (let b = 0; b < this.gamepads[i].buttons.length; b++) {
                        //     if (this.gamepads[i].buttons[b].pressed) {
                        //         console.log(b);
                        //     }
                        // }
                        // console.log(this.gamepads[i].buttons[0].value);
                        // console.log(this.gamepads[i].axes[0]);

                        // A
                        if (this.gamepads[i].buttons[0].pressed) {
                            this.createGamepadPlayer(i);
                        }

                        // Start
                        if (this.players.length > 0 && this.gamepads[i].buttons[9] && this.gamepads[i].buttons[9].pressed) {
                            this.titleUi.hide();
                            this.gameUi.show();
                            this.state = 'game';
                        }
                    }
                }

                if (Keyboard.buttons[Keyboard.SPACE]) {
                    this.createKeyboardPlayer();
                }

                if (this.players.length > 0 && Keyboard.buttons[Keyboard.ENTER]) {
                    this.titleUi.hide();
                    this.gameUi.show();
                    this.state = 'game';
                }

                this.titleUi.render();

                break;
            }

            case 'game': {
                let p = this.players.length;
                while (p--) {
                    this.players[p].loop();
                }
                this.gameUi.render();
                break;
            }
        }
    }

    uid() {
        return this.nextId++;
    }
}
