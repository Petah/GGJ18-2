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
        this.maxAcceleration = 400;
        this.maxVelocity = 400;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.friction = 1;

        this.rotation = 0;
        this.rotationVelocity = 0;
        this.rotationMaxVelocity = 400;
        this.rotationAcceleration = 0;
        this.rotationMaxAcceleration = 4000;
        this.rotationFriction = 5;
    }

    accelerate(xAcceleration, yAcceleration) {
        this.xAcceleration = xAcceleration;
        this.yAcceleration = yAcceleration;
    }

    motionAdd(acceleration, direction) {
        this.xAcceleration += acceleration * Math.cos(Math.PI / 180 * direction);
        this.yAcceleration -= acceleration * Math.sin(Math.PI / 180 * direction);
    }

    rotate(rotationAcceleration) {
        this.rotationAcceleration = rotationAcceleration;
    }

    loop() {
        // Acceleration
        this.xVelocity += this.xAcceleration * this.maxAcceleration * this.game.deltaTime;
        this.yVelocity += this.yAcceleration * this.maxAcceleration * this.game.deltaTime;
        if (this.xVelocity > this.maxVelocity) {
            this.xVelocity = this.maxVelocity;
        }
        if (this.xVelocity < -this.maxVelocity) {
            this.xVelocity = -this.maxVelocity;
        }
        if (this.yVelocity > this.maxVelocity) {
            this.yVelocity = this.maxVelocity;
        }
        if (this.yVelocity < -this.maxVelocity) {
            this.yVelocity = -this.maxVelocity;
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

        this.rotationVelocity += this.rotationAcceleration * this.rotationMaxAcceleration * this.game.deltaTime;
        if (this.rotationVelocity > this.maxVelocity) {
            this.rotationVelocity = this.maxVelocity;
        }
        if (this.rotationVelocity < -this.rotationMaxVelocity) {
            this.rotationVelocity = -this.rotationMaxVelocity;
        }

        this.rotationVelocity /= 1 + this.rotationFriction * this.game.deltaTime;

        this.rotation += this.rotationVelocity * this.game.deltaTime;
        while (this.rotation < 0) {
            this.rotation += 360;
        }

        while (this.rotation >= 360) {
            this.rotation -= 360;
        }
    }
}
