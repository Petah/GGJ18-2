const SvgRenderer = require('./renderer/svg');

module.exports = class Client {
    constructor(game) {
        this.game = game;

        this.renderer = new SvgRenderer(this.game);
    }

    connect() {
        this.socketReady = false;
        // this.bind();

        // Create WebSocket connection.
        this.socket = new WebSocket('ws://' + location.hostname + ':8081');

        // Connection opened
        this.socket.addEventListener('open', (event) => {
            this.socketReady = true;
            this.send('reset');
            this.send('view', {
                x: 0,
                y: 0,
                width: this.renderer.width,
                height: this.renderer.height,
            });
        });

        // Listen for messages
        this.socket.addEventListener('message', (event) => {
            let message;
            try {
                message = JSON.parse(event.data);
            } catch (e) {
                console.log('Invalid message', event.data);
                return;
            }
            switch (message.type) {
                case 'update': {
                    let i = message.data.updates.length;
                    while (i--) {
                        this.renderer.moveSprite(...message.data.updates[i]);
                    }
                    this.renderer.cullSprites(message.data.updates);
                    this.renderer.sortSprites();

                    if (message.data.renderer) {
                        this.renderer.moveCamera(message.data.renderer.x, message.data.renderer.y, message.data.renderer.zoom);
                    }
                    break;
                }

                case 'hud': {
                    this.game.gameUi.data = message.data;
                    break;
                }

                case 'playAudioAtPoint': {
                    if (message.data.audioClip) {
                        // @Todo
                        // Check if object inside viewport
                        // console.log(`Playing audioClip: ${message.data.audioClip}`);
                        audio.play(message.data.audioClip);
                    }
                    break;
                }

                case 'win': {
                    console.log('win');
                    this.game.gameUi.hide();
                    this.game.winUi.show();
                    break;
                }

                case 'explode': {
                    if (this.renderer.explode) {
                        this.renderer.explode.forEach((e) => {
                            e.emit(message.data.x, message.data.y);
                        })
                    }
                    break;
                }

                case 'blood': {
                    if (this.renderer.blood) {
                        this.renderer.blood.forEach((e) => {
                            e.emit(message.data.x, message.data.y);
                        })
                    }
                    break;
                }
            }
        });
    }

    send(type, data = {}) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: type,
                data: data,
            }));
        }
    }

    updateInput() {
        const move = {
            x: 0,
            y: 0,
        };
        if (this.upDown) {
            move.y = -1;
        } else if (this.downDown) {
            move.y = 1;
        }
        if (this.leftDown) {
            move.x = -1;
        } else if (this.rightDown) {
            move.x = 1;
        }
        this.send('updateInput', {
            move: move,
            shoot: this.shootDown,
        });
    }
}
