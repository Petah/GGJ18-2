const logger = new (require('../common/logger'))(__filename);
const Server = require('./server-udp');
const Team = require('./team');

module.exports = class Game {
    constructor() {
        this.server = new Server(this);
        this.teamAmount = 2;
        this.teams = [];
        this.gameObjects = [];
        this.gameObjectsToRemove = [];

        this.mapWidth = 2000;
        this.mapHeight = 2000;

        this.powerUpCooldown = 0;
        this.collisions = {};
        this.stopped = false;

        this.nextId = 1;

        this.currentTime = 0;
        this.deltaTime = 0;
    }

    start() {
        logger.log('Game start');
        this.server.start();

        let lastSecond = 0;
        const hrTimeInit = process.hrtime();
        let previousTime = hrTimeInit[0] + hrTimeInit[1] / 1000000000;
        let updates = 0;

        const gameLoop = () => {
            if (this.stopped) {
                return;
            }
            const hrTime = process.hrtime();
            this.currentTime = hrTime[0] + hrTime[1] / 1000000000;
            this.deltaTime = this.currentTime - previousTime;
            previousTime = this.currentTime;
            updates++;

            if (lastSecond <= this.currentTime - 1) {
                lastSecond = this.currentTime;
                logger.log('UPS', updates, 'Game Objects', this.gameObjects.length);
                updates = 0;
            }

            this.loop();

            if (this.gameObjectsToRemove.length > 0) {
                this.gameObjects = this.gameObjects.filter(gameObject => this.gameObjectsToRemove.indexOf(gameObject.id) === -1);
                this.gameObjectsToRemove = [];
            }

            this.id = setImmediate(gameLoop);

        };
        this.id = setImmediate(gameLoop);
    }

    stop() {
        logger.log('');
        logger.log('Game stop');
        // this.server.stop();
        this.stopped = true;
        clearImmediate(this.id);
        this.id = null;
    }

    loop() {
        let g = this.gameObjects.length;
        while (g--) {
            this.gameObjects[g].loop();
        }
    }

    reset() {
        logger.log('Game reset');
        this.gameObjects = [];
        this.gameObjects.push(this.server);

        const team = new Team(this, 1);
        this.gameObjects.push(team);
        this.teams.push(team);
    }

    removeGameObject(gameObject) {
        this.gameObjectsToRemove.push(gameObject.id);
    }

    playAudioAtPoint(audioClip, x, y) {
        this.server.send('playAudioAtPoint', {
            audioClip,
            x,
            y,
        });
    }

    collisionCheck() {
        this.collisions = {};
        let g = this.gameObjects.length;
        while (g--) {
            this.collisions[this.gameObjects[g].id] = this.checkCollision(this.gameObjects[g]);
        }
    }

    checkCollision(gameObject) {
        const result = [];
        let i = this.gameObjects.length;
        while (i--) {
            if (gameObject.id === this.gameObjects[i].id) {
                continue;
            }
            const distance = math.pointDistance(gameObject.x, gameObject.y, this.gameObjects[i].x, this.gameObjects[i].y);
            if (distance < gameObject.collisionRadius + this.gameObjects[i].collisionRadius) {
                result.push(this.gameObjects[i]);
            }
        }
        return result;
    }

    win() {
        this.stop();
        this.server.send('win', {});
    }

    uid() {
        return this.nextId++;
    }
}

