module.exports = class SvgRenderer {
    constructor(game) {
        this.game = game;
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        window.SVG = this.svg;
        document.body.appendChild(this.svg);

        this.sprites = {};

        this.loadSvgs();
    }

    moveSprite(id, x, y, rotation, layer, spriteAsset) {
        if (!this.sprites[id]) {
            this.sprites[id] = this.svgs.spaceShip.cloneNode(true);
            this.svg.appendChild(this.sprites[id]);
        }
        this.sprites[id].setAttribute('transform', `translate(${x} ${y}) rotate(${rotation})`);
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

    loadSvgs() {
        this.svgs = {};
        this.loadSvg('/images/space-ship.svg').then(svg => this.svgs.spaceShip = svg);
    }

    async loadSvg(url) {
        const response = await fetch(url);
        const svgText = await response.text();
        const svgNode = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform-origin', '50 50');
        while (svgNode.firstChild.firstChild) {
            group.appendChild(svgNode.firstChild.firstChild);
        }
        return group;
    }

    get width() {
        return this.svg.offsetWidth;
    }

    get height() {
        return this.svg.offsetHeight;
    }
}
