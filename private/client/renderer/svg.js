module.exports = class SvgRenderer {
    constructor(game) {
        this.game = game;
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        window.SVG = this.svg;
        document.body.appendChild(this.svg);

        this.sprites = {};
    }

    moveSprite(id, x, y, layer, spriteAsset) {
        if (!this.sprites[id]) {
            this.sprites[id] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            this.svg.appendChild(this.sprites[id]);
        }
        this.sprites[id].setAttribute('r', 10);
        this.sprites[id].setAttribute('cx', x);
        this.sprites[id].setAttribute('cy', y);
    }

    cullSprites(gameObjects) {
        // for (let id in this.sprites) {
        //     let found = false;
        //     let i = gameObjects.length;
        //     while (i--) {
        //         if (gameObjects[i][0] == id) {
        //             found = true;
        //             break;
        //         }
        //     }
        //     if (!found) {
        //         if (this.sprites[id].layer) {
        //             this.layers[this.sprites[id].layer].removeChild(this.sprites[id]);
        //             delete this.sprites[id];
        //         }
        //     }
        // }
    }

    sortSprites() {

    }

    moveCamera(x, y, zoom) {

    }

    get width() {
        return this.svg.offsetWidth;
    }

    get height() {
        return this.svg.offsetHeight;
    }
}
