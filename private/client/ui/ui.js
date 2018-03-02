module.exports = class Ui {
    constructor(game, elementId) {
        this.game = game;
        this.element = document.getElementById(elementId);
    }

    render() {
        if (this.html != this.lastHtml) {
            this.element.innerHTML = this.html;
            this.lastHtml = this.html;
        }
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}
