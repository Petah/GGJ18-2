const logger = new (require('../common/logger'))(__filename);
const Player = require('./player');
const WebSocket = require('ws');

module.exports = class Client {
    constructor(game, server, webSocketClient, id) {
        this.game = game;
        this.server = server;
        this.webSocketClient = webSocketClient;
        this.id = id;
        this.nextUpdate = 0;

        this.players = {};
        this.speed = 200;
        // this.unit = new MissileUnit(this.game, 500, 500, 0, 2, 0, 0);
        // this.game.gameObjects.push(this.unit);

        this.view = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        };

        this.webSocketClient.on('message', (message) => {
            message = JSON.parse(message);
            // logger.log('Client message', message);
            switch (message.type) {
                case 'reset': {
                    this.game.reset();
                    break;
                }

                case 'view': {
                    logger.log('Client view', message.data);
                    this.view.x = message.data.x;
                    this.view.y = message.data.y;
                    this.view.width = message.data.width;
                    this.view.height = message.data.height;
                    break;
                }

                case 'updateInput': {
                    const player = this.players[message.data.id];
                    if (message.data.switchUnit) {
                        this.game.teams[0].nextUnit(player);
                    }
                    if (player && player.unit) {
                        player.unit.accelerate(message.data.move.x, message.data.move.y);
                        player.unit.shooting = message.data.shoot;
                    }
                    break;
                }

                case 'createPlayer': {
                    logger.log('Create player', message.data);
                    const player = new Player(this.game, message.data.id)
                    this.players[message.data.id] = player;
                    this.game.teams[0].addPlayer(player);
                    player.team = this.game.teams[0];
                    break;
                }
            }
        });
    }

    loop() {
        // if (this.game.gameObjects.length) {
        //     const averageX = this.game.gameObjects.reduce((p, c) => c.x + p, 0) / this.game.gameObjects.length;
        //     const averageY = this.game.gameObjects.reduce((p, c) => c.y + p, 0) / this.game.gameObjects.length;
        //     this.view.x = averageX - this.view.width / 2;
        //     this.view.y = averageY - this.view.height / 2;
        // }
        let found = false;
        for (let id in this.players) {
            if (this.players[id].unit) {
                this.view.x = this.players[id].unit.x - this.view.width / 2;
                this.view.y = this.players[id].unit.y - this.view.height / 2;
                found = true;
                break;
            }
        }
        // if (!found) {
        //     for (let id in this.players) {
        //         if (this.players[id].team.spawner) {
        //             this.view.x = this.players[id].team.spawner.x - this.view.width / 2;
        //             this.view.y = this.players[id].team.spawner.y - this.view.height / 2;
        //             break;
        //         }
        //     }
        // }

        let hud = {
            collectState: {},
        };

        if (this.view.x < 0) {
            this.view.x = 0;
        }
        if (this.view.y < 0) {
            this.view.y = 0;
        }
        if (this.view.x + this.view.width > this.game.mapWidth) {
            this.view.x = this.game.mapWidth - this.view.width;
        }
        if (this.view.y + this.view.height > this.game.mapHeight) {
            this.view.y = this.game.mapHeight - this.view.height;
        }

        const padding = 200;
        const updates = [];
        let i = this.game.gameObjects.length;
        while (i--) {
            if (
                this.game.gameObjects[i].sprite
            //     this.game.gameObjects[i].x > this.view.x - padding &&
            //     this.game.gameObjects[i].x < this.view.x + this.view.width + (padding * 2) &&
            //     this.game.gameObjects[i].y > this.view.y - padding &&
            //     this.game.gameObjects[i].y < this.view.y + this.view.height + (padding * 2)
            ) {
                updates.push([
                    this.game.gameObjects[i].id,
                    this.game.gameObjects[i].x,
                    this.game.gameObjects[i].y,
                    this.game.gameObjects[i].layer,
                    this.game.gameObjects[i].sprite,
                    this.game.gameObjects[i].moving,
                    this.game.gameObjects[i].type,
                ]);
            }
        }
        this.send('update', {
            hud: hud,
            renderer: {
                x: this.view.x,
                y: this.view.y,
                zoom: 1,
            },
            updates: updates,
        });
        this.nextUpdate = this.game.currentTime + 0.016;
    }

    send(type, data) {
        if (this.webSocketClient.readyState !== WebSocket.OPEN) {
            logger.log('Socket not ready')
            return;
        }
        this.webSocketClient.send(JSON.stringify({
            type: type,
            data: data,
        }));
    }
}
