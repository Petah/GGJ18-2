module.exports = class GameMath {
    static pointDirection(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    }

    static pointDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }

    static lengthDirX(length, direction) {
        return Math.cos(direction * Math.PI / 180) * length;
    }

    static lengthDirY(length, direction) {
        return Math.sin(direction * Math.PI / 180) * length;
    }

    static motionAdd(self, speed, direction) {
        let x2 = lengthDirX(self.speed, self.direction) + lengthDirX(speed, direction);
        let y2 = lengthDirY(self.speed, self.direction) + lengthDirY(speed, direction);
        self.speed = Math.hypot(x2, y2);
        self.direction = pointDirection(0, 0, x2, y2);
    }

    static randomSign() {
        return Math.random() > 0.5 ? -1 : 1;
    }
}
