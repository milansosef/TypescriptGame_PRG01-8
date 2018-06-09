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
        this.sprite.texture = PIXI.loader.resources[this.imgSource].texture;
        Game.instance().PIXI().stage.addChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    }
    GameObject.prototype.getRect = function () {
        return this.sprite.getBounds();
    };
    GameObject.prototype.update = function () {
    };
    GameObject.prototype.removeMe = function () {
    };
    return GameObject;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(character_x, character_y, aimAngle) {
        var _this = _super.call(this, './assets/images/Arrow.png') || this;
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
        this.checkOutofScreen();
        var rightUp = this.sprite.rotation < 0 && this.sprite.rotation > Math.PI / -2;
        var rightDown = this.sprite.rotation < Math.PI / 2 && this.sprite.rotation > 0;
        if (rightUp || rightDown) {
            this.sprite.rotation += 0.01;
        }
        else {
            this.sprite.rotation -= 0.01;
        }
        this.y_speed += 0.1;
        this.sprite.x += this.x_speed;
        this.sprite.y += this.y_speed;
    };
    Arrow.prototype.checkOutofScreen = function () {
        if (this.sprite.position.x < 0 - this.sprite.width || this.sprite.position.x > Game.instance().canvasWidth) {
            this.removeMe();
        }
    };
    return Arrow;
}(GameObject));
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        var _this = _super.call(this, './assets/images/archer.png') || this;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.aimAngle = 0;
        _this.isReloading = false;
        _this.isJumping = false;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        _this.sprite.position.x = Game.instance().PIXI().stage.width / 2 - _this.sprite.width / 2;
        _this.sprite.position.y = Game.instance().PIXI().stage.height / 2 - _this.sprite.height / 2;
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
        Game.instance().addArrow(new Arrow(this.sprite.x, this.sprite.y, this.aimAngle));
    };
    Character.prototype.onClickListener = function (event) {
        this.shoot();
    };
    Character.prototype.onMouseMove = function (event) {
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
        if (this.sprite.y > window.innerHeight - 150) {
            this.isJumping = false;
            this.sprite.y = window.innerHeight - 150;
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
        this.canvasWidth = 1280;
        this.canvasHeigth = 768;
        this.background = new PIXI.Sprite();
        this.app = new PIXI.Application({ width: this.canvasWidth, height: this.canvasHeigth });
        this.app.stage.interactive = true;
        document.body.appendChild(this.app.view);
        this.tiledMap = new PIXI.Container();
        this.app.stage.addChild(this.tiledMap);
        PIXI.loader
            .add([
            "./assets/map_x64.tmx",
            "./assets/tilesheet.json",
            "./assets/images/bg.png",
            "./assets/images/archer.png",
            "./assets/images/Arrow.png"
        ])
            .load(function () { return _this.setup(); });
    }
    Game.instance = function () {
        if (!Game.game_instance) {
            Game.game_instance = new Game();
        }
        return Game.game_instance;
    };
    Game.prototype.PIXI = function () {
        return this.app;
    };
    Game.prototype.setup = function () {
        var _this = this;
        this.character = new Character();
        this.arrows = new Array();
        this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/map_x64.tmx"));
        this.app.ticker.add(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        this.character.update();
        for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
            var a = _a[_i];
            a.update();
        }
        this.app.renderer.render(this.app.stage);
    };
    Game.prototype.addArrow = function (a) {
        this.arrows.push(a);
    };
    return Game;
}());
window.addEventListener("load", function () {
    Game.instance();
});
var Level = (function () {
    function Level(stage) {
        this.sprites = new Array();
        var id = PIXI.loader.resources["./assets/tilesheet.json"].textures;
        this.createGroundRow(stage, id, 10);
    }
    Level.prototype.createGroundRow = function (stage, id, num) {
        for (var i = 0; i < num; i++) {
            var sprite = new PIXI.Sprite(id["2.png"]);
            sprite.position.x = i * sprite.width;
            sprite.position.y = Game.instance().canvasHeigth - sprite.height;
            this.sprites.push(sprite);
            stage.addChild(sprite);
        }
    };
    return Level;
}());
var MapSpritesPool = (function () {
    function MapSpritesPool() {
        this.sprites = [];
        var id = Game.instance().PIXI().loader.resources["./images/tilesheet.json"].textures;
        this.addMapSprites(6, id);
    }
    MapSpritesPool.prototype.addMapSprites = function (amount, id) {
        for (var i = 0; i < amount; i++) {
            var sprite = new PIXI.Sprite(id["1.png"]);
            this.sprites.push(sprite);
        }
    };
    ;
    return MapSpritesPool;
}());
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