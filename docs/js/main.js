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
    function GameObject(e, imgSource) {
        this.element = document.createElement(e);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.posy = 0;
        this.posx = 0;
        this.rotation = 0;
    }
    GameObject.prototype.getRect = function () {
        return this.element.getBoundingClientRect();
    };
    GameObject.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) rotate(" + this.rotation + "deg)";
    };
    GameObject.prototype.removeMe = function () {
        this.element.remove();
    };
    return GameObject;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(character_x, character_y, aimAngle) {
        var _this = _super.call(this, "arrow", './images/Arrow.png') || this;
        _this.posx = character_x;
        _this.posy = character_y;
        _this.rotation = aimAngle;
        _this.speed_x = Math.cos(_this.rotation / 180 * Math.PI) * 10;
        _this.speed_y = Math.sin(_this.rotation / 180 * Math.PI) * 10;
        console.log('rotation: ' + _this.rotation);
        return _this;
    }
    Arrow.prototype.update = function () {
        _super.prototype.update.call(this);
        console.log("rotation = " + this.rotation);
        if (this.rotation > -90 && this.rotation < 90) {
            this.rotation++;
        }
        else if ((this.rotation < -90 && this.rotation >= -181) || (this.rotation <= 180 && this.rotation > 90)) {
            if (this.rotation < -180) {
                this.rotation = 180;
            }
            this.rotation--;
        }
        this.speed_x = Math.cos(this.rotation / 180 * Math.PI) * 10;
        this.speed_y = Math.sin(this.rotation / 180 * Math.PI) * 10;
        this.posx += this.speed_x;
        this.posy += this.speed_y;
    };
    return Arrow;
}(GameObject));
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        var _this = _super.call(this, "character", './images/archer.png') || this;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.x_speed = 0;
        _this.y_speed = 0;
        _this.aimAngle = 0;
        _this.isReloading = false;
        _this.isJumping = false;
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
        g.addArrow(new Arrow(this.posx, this.posy, this.aimAngle));
    };
    Character.prototype.onClickListener = function (event) {
        this.shoot();
    };
    Character.prototype.onMouseMove = function (event) {
        var g = Game.getInstance();
        var mouseX = event.clientX - g.canvas.getBoundingClientRect().left;
        var mouseY = event.clientY - g.canvas.getBoundingClientRect().top;
        mouseX -= this.posx + this.getRect().width / 2;
        mouseY -= this.posy + this.getRect().height / 2;
        this.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
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
        this.posx += this.x_speed;
        this.posy += this.y_speed;
        this.x_speed *= 0.9;
        this.y_speed *= 0.9;
        if (this.posy > window.innerHeight - 16 - 512) {
            this.isJumping = false;
            this.posy = window.innerHeight - 16 - 512;
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
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext("2d");
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
        for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
            var a = _a[_i];
            a.update();
        }
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