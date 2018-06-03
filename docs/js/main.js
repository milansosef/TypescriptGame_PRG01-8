"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = (function () {
    function GameObject(img) {
        this.sprite = new PIXI.Sprite();
        this.x_speed = 0;
        this.y_speed = 0;
        this.imgSource = img;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    }
    GameObject.prototype.initTexture = function (stage) {
        this.sprite.texture = Game.PIXI.loader.resources[this.imgSource].texture;
        stage.addChild(this.sprite);
    };
    GameObject.prototype.getRect = function () {
        return this.sprite.getBounds();
    };
    GameObject.prototype.update = function () {
    };
    GameObject.prototype.removeMe = function () {
        this.sprite.removeAllListeners();
        this.sprite.destroy();
    };
    return GameObject;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(character_x, character_y, aimAngle) {
        var _this = _super.call(this, './images/Arrow.png') || this;
        _this.sprite.x = character_x;
        _this.sprite.y = character_y;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        _this.sprite.rotation = aimAngle;
        _this.x_speed = Math.cos(_this.sprite.rotation) * 10;
        _this.y_speed = Math.sin(_this.sprite.rotation) * 10;
        console.log('sprite.rotation: ' + _this.sprite.rotation);
        return _this;
    }
    Arrow.prototype.update = function () {
        _super.prototype.update.call(this);
        var leftUp = this.sprite.rotation <= Math.PI / -2 && this.sprite.rotation >= Math.PI * -1;
        var leftDown = this.sprite.rotation <= Math.PI && this.sprite.rotation >= Math.PI / 2;
        var rightUp = this.sprite.rotation < 0 && this.sprite.rotation > Math.PI / -2;
        var rightDown = this.sprite.rotation < Math.PI / 2 && this.sprite.rotation > 0;
        if (leftUp || leftDown) {
            this.sprite.rotation -= 0.01;
        }
        if (rightUp || rightDown) {
            this.sprite.rotation += 0.01;
        }
        this.y_speed += 0.1;
        this.sprite.x += this.x_speed;
        this.sprite.y += this.y_speed;
    };
    return Arrow;
}(GameObject));
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        var _this = _super.call(this, './images/archer.png') || this;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.aimAngle = 0;
        _this.isReloading = false;
        _this.isJumping = false;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        window.addEventListener("mousemove", function (e) { return _this.onMouseMove(e); });
        window.addEventListener("click", function (e) { return _this.onClickListener(e); });
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
        return _this;
    }
    Character.prototype.update = function () {
        _super.prototype.update.call(this);
        this.movementController();
    };
    Character.prototype.shoot = function () {
        var g = Game.getInstance();
        g.addArrow(new Arrow(this.sprite.x, this.sprite.y, this.aimAngle));
    };
    Character.prototype.onClickListener = function (event) {
        this.shoot();
    };
    Character.prototype.onMouseMove = function (event) {
        var g = Game.getInstance();
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        mouseX -= this.sprite.x;
        mouseY -= this.sprite.y;
        this.aimAngle = Math.atan2(mouseY, mouseX);
    };
    Character.prototype.keyListener = function (event) {
        var key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 32:
                this.up = key_state;
                break;
            case 65:
                this.left = key_state;
                break;
            case 68:
                this.right = key_state;
                break;
        }
    };
    Character.prototype.movementController = function () {
        if (this.up && this.isJumping == false) {
            this.y_speed -= 20;
            this.isJumping = true;
        }
        if (this.left) {
            this.x_speed -= 0.5;
        }
        if (this.right) {
            this.x_speed += 0.5;
        }
        this.y_speed += 1.5;
        this.sprite.x += this.x_speed;
        this.sprite.y += this.y_speed;
        this.x_speed *= 0.9;
        this.y_speed *= 0.9;
        if (this.sprite.y > window.innerHeight - 16 - 512) {
            this.isJumping = false;
            this.sprite.y = window.innerHeight - 16 - 512;
            this.y_speed = 0;
        }
    };
    Character.prototype.removeMe = function () {
        _super.prototype.removeMe.call(this);
    };
    return Character;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.background = new PIXI.Sprite();
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth });
        document.body.appendChild(Game.PIXI.view);
        this.character = new Character();
        this.arrows = new Array();
        Game.PIXI.loader
            .add([
            "./images/bg.png",
            "./images/archer.png",
            "./images/Arrow.png"
        ])
            .load(function () { return _this.setup(); });
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.setup = function () {
        var _this = this;
        this.background.texture = Game.PIXI.loader.resources["./images/bg.png"].texture;
        Game.PIXI.stage.addChild(this.background);
        this.character.initTexture(Game.PIXI.stage);
        Game.PIXI.renderer;
        Game.PIXI.ticker.add(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        this.character.update();
        for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
            var a = _a[_i];
            a.update();
        }
        Game.PIXI.renderer.render(Game.PIXI.stage);
    };
    Game.prototype.addArrow = function (a) {
        this.arrows.push(a);
        a.initTexture(Game.PIXI.stage);
    };
    Game.canvasWidth = 1280;
    Game.canvasHeigth = 768;
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Util = (function () {
    function Util() {
    }
    Util.checkCollision = function (a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    };
    return Util;
}());
//# sourceMappingURL=main.js.map