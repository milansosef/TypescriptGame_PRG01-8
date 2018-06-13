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
    function GameObject(img, cWidth, cHeight) {
        this.object = new PIXI.Container();
        this.sprite = new PIXI.Sprite();
        this.speed = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.imgSource = img;
        this.colliderWidth = cWidth;
        this.colliderHeight = cHeight;
        this.sprite.texture = PIXI.loader.resources[this.imgSource].texture;
        this.object.addChild(this.sprite);
        this.getColliderSprite();
        Game.instance().getPIXI().stage.addChild(this.object);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    }
    GameObject.prototype.getSprite = function () {
        return this.sprite;
    };
    GameObject.prototype.getColliderSprite = function () {
        if (!this.colliderSprite) {
            var colliderRect = new PIXI.Graphics();
            colliderRect.visible = false;
            colliderRect.drawRect(this.sprite.x, this.sprite.y, this.colliderWidth, this.colliderHeight);
            colliderRect.endFill();
            var colliderTexture = Game.instance().getPIXI().renderer.generateTexture(colliderRect);
            this.colliderSprite = new PIXI.Sprite(colliderTexture);
            this.colliderSprite.anchor.x = 0.5;
            this.colliderSprite.anchor.y = 0.5;
            this.object.addChild(this.colliderSprite);
        }
        return this.colliderSprite;
    };
    GameObject.prototype.getRect = function () {
        return this.sprite.getBounds();
    };
    GameObject.prototype.update = function () {
        this.sprite.x = this.colliderSprite.x;
        this.sprite.y = this.colliderSprite.y;
    };
    GameObject.prototype.removeMe = function () {
    };
    return GameObject;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(character_x, character_y, aimAngle, s) {
        var _this = _super.call(this, './assets/images/Arrow.png', 60, 10) || this;
        _this.speed = s;
        _this.object.x = character_x;
        _this.object.y = character_y;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        _this.colliderSprite.rotation = aimAngle;
        _this.xSpeed = Math.cos(_this.colliderSprite.rotation) * _this.speed;
        _this.ySpeed = Math.sin(_this.colliderSprite.rotation) * _this.speed;
        return _this;
    }
    Arrow.prototype.update = function () {
        _super.prototype.update.call(this);
        this.checkOutofScreen();
        var rightUp = this.colliderSprite.rotation < 0 && this.colliderSprite.rotation > Math.PI / -2;
        var rightDown = this.colliderSprite.rotation < Math.PI / 2 && this.colliderSprite.rotation > 0;
        if (rightUp || rightDown) {
            this.colliderSprite.rotation += 0.01;
        }
        else {
            this.colliderSprite.rotation -= 0.01;
        }
        this.sprite.rotation = this.colliderSprite.rotation;
        this.ySpeed += 0.1;
        this.colliderSprite.x += this.xSpeed;
        this.colliderSprite.y += this.ySpeed;
    };
    Arrow.prototype.checkOutofScreen = function () {
        if (this.object.position.x < 0 - this.object.width || this.object.position.x > Game.instance().canvasWidth) {
            this.removeMe();
            console.log("remove");
        }
    };
    return Arrow;
}(GameObject));
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        var _this = _super.call(this, './assets/images/archer.png', 60, 120) || this;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.isOnGround = true;
        _this.jumpHeight = 40;
        _this.gravity = 1.5;
        _this.aimAngle = 0;
        _this.isReloading = false;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        _this.colliderSprite.x = Game.instance().getPIXI().stage.width / 2 - _this.sprite.width / 2;
        _this.colliderSprite.y = Game.instance().getPIXI().stage.height / 2 - _this.sprite.height / 2;
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
        window.addEventListener("mousemove", function (e) { return _this.updateAim(e); });
        Game.instance().getPIXI().stage.on("mousedown", function () { return _this.shoot(); });
        return _this;
    }
    Character.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.up && this.isOnGround == true) {
            this.ySpeed -= this.jumpHeight;
            this.isOnGround = false;
        }
        if (this.left) {
            this.xSpeed -= 0.5;
        }
        if (this.right) {
            this.xSpeed += 0.5;
        }
        this.ySpeed += this.gravity;
        this.xSpeed *= 0.9;
        this.ySpeed *= 0.9;
        this.colliderSprite.x += this.xSpeed;
        this.colliderSprite.y += this.ySpeed;
    };
    Character.prototype.shoot = function () {
        var arrowSpeed = 10;
        Game.instance().addArrow(new Arrow(this.colliderSprite.x, this.colliderSprite.y, this.aimAngle, arrowSpeed));
    };
    Character.prototype.updateAim = function (event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        mouseX -= this.colliderSprite.x;
        mouseY -= this.colliderSprite.y;
        this.aimAngle = Math.atan2(mouseY, mouseX);
    };
    Character.prototype.handleCollision = function (collision, platform) {
        if (collision) {
            if (collision === "bottom" && this.ySpeed >= 0) {
                this.isOnGround = true;
                this.ySpeed -= this.gravity;
            }
            else if (collision === "top" && this.ySpeed <= 0) {
                this.ySpeed = 0;
            }
            else if (collision === "right" && this.xSpeed >= 0) {
                this.xSpeed = 0;
            }
            else if (collision === "left" && this.xSpeed <= 0) {
                this.xSpeed = 0;
            }
            if (collision !== "bottom" && this.ySpeed > 0) {
                this.isOnGround = false;
            }
        }
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
    Character.prototype.removeMe = function () {
        _super.prototype.removeMe.call(this);
    };
    return Character;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.bump = new Bump(PIXI);
        this.platforms = [];
        this.canvasWidth = 1280;
        this.canvasHeigth = 768;
        this.PIXI = new PIXI.Application({ width: this.canvasWidth, height: this.canvasHeigth });
        this.PIXI.stage.interactive = true;
        document.body.appendChild(this.PIXI.view);
        this.tiledMap = new PIXI.Container();
        this.PIXI.stage.addChild(this.tiledMap);
        PIXI.loader
            .add([
            "./assets/tileMaps/map_x64.tmx",
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
    Game.prototype.setup = function () {
        var _this = this;
        this.character = new Character();
        this.arrows = new Array();
        this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/tileMaps/map_x64.tmx"));
        for (var _i = 0, _a = this.tiledMap.children[0].children[2].children; _i < _a.length; _i++) {
            var t = _a[_i];
            this.platforms.push(t);
        }
        for (var _b = 0, _c = this.platforms; _b < _c.length; _b++) {
            var p = _c[_b];
            p.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
        this.PIXI.ticker.add(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        this.character.update();
        this.checkCharacterVsPlatforms();
        for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
            var a = _a[_i];
            a.update();
        }
        this.PIXI.renderer.render(this.PIXI.stage);
    };
    Game.prototype.addArrow = function (a) {
        this.arrows.push(a);
    };
    Game.prototype.checkCharacterVsPlatforms = function () {
        var _this = this;
        var characterVsPlatforms;
        for (var _i = 0, _a = this.platforms; _i < _a.length; _i++) {
            var p = _a[_i];
            characterVsPlatforms = this.bump.hit(this.character.getColliderSprite(), p, true, true, true, function (collision, platform) {
                _this.character.handleCollision(collision, platform);
            });
        }
    };
    Game.prototype.getPIXI = function () {
        return this.PIXI;
    };
    Game.prototype.getBump = function () {
        return this.bump;
    };
    Game.prototype.getPlatforms = function () {
        return this.platforms;
    };
    return Game;
}());
window.addEventListener("load", function () {
    Game.instance();
});
var Util = (function () {
    function Util() {
    }
    return Util;
}());
//# sourceMappingURL=main.js.map