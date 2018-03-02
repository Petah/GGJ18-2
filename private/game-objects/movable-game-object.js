const GameMath = require('../common/game-math');

module.exports = class MoveableGameObject {
    constructor(
        game,
        x,
        y,
    ) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.id = this.game.uid();
        this.layer = 1;
        this.sprite = 0;
        this.direction = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.acceleration = 4000;
        this.maxSpeed = 400;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.friction = 5;
    }

    accelerate(xAcceleration, yAcceleration) {
        this.xAcceleration = xAcceleration;
        this.yAcceleration = yAcceleration;
    }

    loop() {
        // Acceleration
        this.xVelocity += this.xAcceleration * this.acceleration * this.game.deltaTime;
        this.yVelocity += this.yAcceleration * this.acceleration * this.game.deltaTime;
        if (this.xVelocity > this.maxSpeed) {
            this.xVelocity = this.maxSpeed;
        }
        if (this.xVelocity < -this.maxSpeed) {
            this.xVelocity = -this.maxSpeed;
        }
        if (this.yVelocity > this.maxSpeed) {
            this.yVelocity = this.maxSpeed;
        }
        if (this.yVelocity < -this.maxSpeed) {
            this.yVelocity = -this.maxSpeed;
        }

        // Friction
        // if (!this.xAcceleration && !this.yAcceleration) {
        this.xAcceleration /= 1 + this.friction * this.game.deltaTime;
        this.yAcceleration /= 1 + this.friction * this.game.deltaTime;
        this.xVelocity /= 1 + this.friction * this.game.deltaTime;
        this.yVelocity /= 1 + this.friction * this.game.deltaTime;
        // }

        this.xPrevious = this.x;
        this.yPrevious = this.y;
        this.x += this.xVelocity * this.game.deltaTime;
        this.y += this.yVelocity * this.game.deltaTime;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > this.game.mapWidth) {
            this.x = this.game.mapWidth;
        }
        if (this.y > this.game.mapHeight) {
            this.y = this.game.mapHeight;
        }
        if (this.xPrevious != this.x || this.yPrevious != this.y) {
            this.direction = GameMath.pointDirection(this.xPrevious, this.yPrevious, this.x, this.y);
            while (this.direction < 0) {
                this.direction += 360;
            }

            while (this.direction >= 360) {
                this.direction -= 360;
            }
        }
    }
}
