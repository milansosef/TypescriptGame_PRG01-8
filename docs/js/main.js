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
    function GameObject(e) {
        this.element = document.createElement(e);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.posy = 0;
        this.posx = 0;
    }
    GameObject.prototype.getRect = function () {
        return this.element.getBoundingClientRect();
    };
    GameObject.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    };
    GameObject.prototype.removeMe = function () {
        this.element.remove();
    };
    return GameObject;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow() {
        var _this = _super.call(this, "arrow") || this;
        _this.posx = 200;
        _this.posy = 300;
        _this.speed = 20;
        return _this;
    }
    return Arrow;
}(GameObject));
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        var _this = _super.call(this, "character") || this;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.x_velocity = 0;
        _this.y_velocity = 0;
        _this.isReloading = false;
        _this.isJumping = false;
        _this.posx = 0;
        _this.posy = 0;
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
        g.addArrow(new Arrow());
    };
    Character.prototype.keyListener = function (event) {
        var key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 32:
                this.up = key_state;
                console.log(key_state);
                break;
            case 65:
                this.left = key_state;
                console.log("left");
                break;
            case 68:
                console.log("right");
                this.right = key_state;
                break;
        }
    };
    Character.prototype.movementController = function () {
        if (this.up && this.isJumping == false) {
            this.y_velocity -= 20;
            this.isJumping = true;
        }
        if (this.left) {
            this.x_velocity -= 0.5;
        }
        if (this.right) {
            this.x_velocity += 0.5;
        }
        this.y_velocity += 1.5;
        this.posx += this.x_velocity;
        this.posy += this.y_velocity;
        this.x_velocity *= 0.9;
        this.y_velocity *= 0.9;
        if (this.posy > window.innerHeight - 16 - 512) {
            this.isJumping = false;
            this.posy = window.innerHeight - 16 - 512;
            this.y_velocity = 0;
        }
    };
    Character.prototype.removeMe = function () {
        _super.prototype.removeMe.call(this);
    };
    return Character;
}(GameObject));
var Game = (function () {
    function Game() {
        this.character = new Character();
        this.arrows = new Array();
        this.gameLoop();
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.character.update();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.addArrow = function (a) {
        this.arrows.push(a);
    };
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