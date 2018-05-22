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
        _this.leftSpeed = 0;
        _this.rightSpeed = 0;
        _this.downSpeed = 0;
        _this.upSpeed = 0;
        _this.isReloading = false;
        _this.posx = 0;
        _this.posy = 300;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        return _this;
    }
    Character.prototype.update = function () {
        _super.prototype.update.call(this);
        this.posx += this.rightSpeed;
        this.posx -= this.leftSpeed;
        this.posy -= this.upSpeed;
        this.posy += this.downSpeed;
    };
    Character.prototype.schoot = function () {
        var g = Game.getInstance();
        g.addArrow(new Arrow());
    };
    Character.prototype.removeMe = function () {
        var _this = this;
        _super.prototype.removeMe.call(this);
        window.removeEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.removeEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    };
    Character.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 32:
                console.log("jumping!");
                this.schoot();
                this.upSpeed = 5;
                break;
            case 83:
                this.downSpeed = 5;
                break;
            case 65:
                this.leftSpeed = 5;
                break;
            case 68:
                this.rightSpeed = 5;
                break;
        }
    };
    Character.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
            case 32:
                this.upSpeed = 0;
                break;
            case 83:
                this.downSpeed = 0;
                break;
            case 65:
                this.leftSpeed = 0;
                break;
            case 68:
                this.rightSpeed = 0;
                break;
        }
    };
    return Character;
}(GameObject));
var Game = (function () {
    function Game() {
        console.log("Game running!");
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