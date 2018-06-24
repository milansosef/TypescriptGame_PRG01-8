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
    GameObject.prototype.update = function () {
        this.sprite.x = this.colliderSprite.x;
        this.sprite.y = this.colliderSprite.y;
    };
    GameObject.prototype.removeMe = function () {
        Game.instance().getPIXI().stage.removeChild(this.object);
    };
    return GameObject;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(c, character_x, character_y, aimAngle, s) {
        var _this = _super.call(this, './assets/images/arrow.png', 30, 5) || this;
        _this.boostActive = false;
        _this.collided = false;
        c.subscribe(_this);
        _this.speed = s;
        _this.object.x = character_x;
        _this.object.y = character_y;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        _this.colliderSprite.anchor.y = -0.9;
        _this.colliderSprite.rotation = aimAngle;
        _this.setSpeed();
        return _this;
    }
    Arrow.prototype.notify = function () {
        if (!this.collided) {
            this.boostActive = true;
            this.speed = 20;
            this.setSpeed();
        }
    };
    Arrow.prototype.setSpeed = function () {
        this.xSpeed = Math.cos(this.colliderSprite.rotation) * this.speed;
        this.ySpeed = Math.sin(this.colliderSprite.rotation) * this.speed;
    };
    Arrow.prototype.update = function () {
        _super.prototype.update.call(this);
        this.checkOutofScreen();
        var rightUp = this.colliderSprite.rotation < 0 && this.colliderSprite.rotation > Math.PI / -2;
        var rightDown = this.colliderSprite.rotation < Math.PI / 2 && this.colliderSprite.rotation > 0;
        if (!this.boostActive && !this.collided) {
            this.ySpeed += 0.1;
            if (rightUp || rightDown) {
                this.colliderSprite.rotation += 0.01;
            }
            else {
                this.colliderSprite.rotation -= 0.01;
            }
        }
        this.sprite.rotation = this.colliderSprite.rotation;
        this.colliderSprite.x += this.xSpeed;
        this.colliderSprite.y += this.ySpeed;
    };
    Arrow.prototype.stopMoving = function () {
        var _this = this;
        this.object.removeChild(this.colliderSprite);
        this.collided = true;
        this.ySpeed = 0;
        this.xSpeed = 0;
        setTimeout(function () {
            Game.instance().removeArrow(_this);
            _this.removeMe();
        }, 6000);
    };
    Arrow.prototype.checkOutofScreen = function () {
        if (this.colliderSprite.position.x < 0 - this.colliderSprite.width || this.colliderSprite.position.x > Game.instance().canvasWidth) {
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
        _this.jumpHeight = 45;
        _this.gravity = 1.5;
        _this.aimAngle = 0;
        _this.isReloading = false;
        _this.sprite.width = 200;
        _this.sprite.height = 200;
        console.log("width", Game.instance().getPIXI().stage.width);
        console.log("height", Game.instance().getPIXI().stage.height);
        _this.colliderSprite.position.x = 650;
        _this.colliderSprite.position.y = 580;
        _this.observers = new Array();
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
        window.addEventListener("mousemove", function (e) { return _this.updateAim(e); });
        Game.instance().getPIXI().stage.on("mousedown", function () { return _this.shoot(); });
        return _this;
    }
    Character.prototype.subscribe = function (o) {
        this.observers.push(o);
    };
    Character.prototype.unsubscribe = function (o) {
    };
    Character.prototype.boost = function () {
        console.log("F key pressed");
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var c = _a[_i];
            c.notify();
        }
    };
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
        var _this = this;
        if (!this.isReloading) {
            var arrowSpeed = 10;
            Game.instance().addArrow(new Arrow(this, this.colliderSprite.x, this.colliderSprite.y, this.aimAngle, arrowSpeed));
            this.isReloading = true;
            setTimeout(function () {
                _this.isReloading = false;
            }, 1000);
        }
        else {
            console.log("Reloading");
        }
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
            case 70:
                if (key_state) {
                    this.boost();
                }
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
        this.points = 0;
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
            "./assets/images/arrow.png",
            "./assets/images/dummy_1.png",
            "./assets/images/dummy_2.png",
            "./assets/images/dummy_3.png"
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
        this.createScoreText();
        this.character = new Character();
        this.targetDummy = new TargetDummy();
        this.gameObjects = new Array();
        this.gameObjects.push(this.character, this.targetDummy);
        this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/tileMaps/map_x64.tmx"));
        for (var _i = 0, _a = this.tiledMap.children[0].children[2].children; _i < _a.length; _i++) {
            var t = _a[_i];
            this.platforms.push(t);
        }
        this.PIXI.ticker.add(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {
            var o = _a[_i];
            o.update();
        }
        this.checkCharacterVsPlatforms();
        this.checkDummyVsArrows();
        this.checkPlatformsVsArrows();
        this.PIXI.renderer.render(this.PIXI.stage);
    };
    Game.prototype.addArrow = function (a) {
        this.gameObjects.push(a);
    };
    Game.prototype.removeArrow = function (a) {
        console.log("Remove arrow");
        this.character.unsubscribe(a);
        var index = this.gameObjects.indexOf(a);
        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }
    };
    Game.prototype.checkCharacterVsPlatforms = function () {
        var _this = this;
        var characterVsPlatforms;
        for (var _i = 0, _a = this.platforms; _i < _a.length; _i++) {
            var p = _a[_i];
            characterVsPlatforms = this.bump.hit(this.character.getColliderSprite(), p, true, false, true, function (collision, platform) {
                _this.character.handleCollision(collision, platform);
            });
        }
    };
    Game.prototype.checkPlatformsVsArrows = function () {
        for (var _i = 0, _a = this.platforms; _i < _a.length; _i++) {
            var p = _a[_i];
            for (var _b = 0, _c = this.gameObjects; _b < _c.length; _b++) {
                var o = _c[_b];
                if (o instanceof Arrow) {
                    var platformsVsArrows = this.bump.hit(p, o.getColliderSprite(), false, true, true);
                    if (platformsVsArrows) {
                        o.stopMoving();
                    }
                }
            }
        }
    };
    Game.prototype.checkDummyVsArrows = function () {
        for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o instanceof Arrow) {
                var dummyVsArrows = this.bump.hit(this.targetDummy.getColliderSprite(), o.getColliderSprite(), false, true, true);
                if (dummyVsArrows) {
                    o.stopMoving();
                    this.setScore();
                }
            }
        }
    };
    Game.prototype.createScoreText = function () {
        var style = new PIXI.TextStyle({
            fill: [
                "black",
                "black"
            ],
            fontFamily: "Impact, Charcoal, sans-serif",
            fontSize: 28
        });
        this.scoreText = new PIXI.Text('Score: ' + this.points, style);
        this.scoreText.anchor.x = -1;
        this.scoreText.anchor.y = -1;
        this.PIXI.stage.addChild(this.scoreText);
    };
    Game.prototype.setScore = function () {
        for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o instanceof TargetDummy) {
                o.timesHit++;
                this.points += 10;
                this.scoreText.text = "Score: " + this.points;
                console.log("Score: " + this.points);
            }
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
var TargetDummy = (function (_super) {
    __extends(TargetDummy, _super);
    function TargetDummy() {
        var _this = _super.call(this, "./assets/images/dummy_1.png", 40, 60) || this;
        _this.timesHit = 0;
        _this.object.x = 600;
        _this.object.y = 344;
        return _this;
    }
    TargetDummy.prototype.update = function () {
        switch (this.timesHit) {
            case 0:
                this.dummyBehaviour = new Idle(this);
                break;
            case 1:
                this.dummyBehaviour = new Afraid(this);
                break;
            case 2:
                this.dummyBehaviour = new Crying(this);
                break;
        }
        this.dummyBehaviour.performBehavior();
    };
    return TargetDummy;
}(GameObject));
var Util = (function () {
    function Util() {
    }
    return Util;
}());
var Afraid = (function () {
    function Afraid(t) {
        this.targetDummy = t;
    }
    Afraid.prototype.performBehavior = function () {
        this.targetDummy.getSprite().texture = PIXI.loader.resources["./assets/images/dummy_2.png"].texture;
    };
    return Afraid;
}());
var Crying = (function () {
    function Crying(t) {
        this.targetDummy = t;
    }
    Crying.prototype.performBehavior = function () {
        this.targetDummy.getSprite().texture = PIXI.loader.resources["./assets/images/dummy_3.png"].texture;
    };
    return Crying;
}());
var Idle = (function () {
    function Idle(t) {
        this.targetDummy = t;
    }
    Idle.prototype.performBehavior = function () {
        this.targetDummy.getSprite().texture = PIXI.loader.resources["./assets/images/dummy_1.png"].texture;
    };
    return Idle;
}());
//# sourceMappingURL=main.js.map