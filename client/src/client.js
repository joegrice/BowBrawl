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
Object.defineProperty(exports, "__esModule", { value: true });
var Phaser = require("phaser-ce");
var socket = require("socket.io");
var GameMain = /** @class */ (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        var _this = this;
        var widthTiles = 12;
        var heightTiles = 8;
        var tileSize = 64;
        _this = _super.call(this, widthTiles * tileSize, heightTiles * tileSize, Phaser.AUTO, "content") || this;
        _this.state.add("Main", Main, false);
        _this.state.start("Main");
        return _this;
    }
    GameMain.prototype.create = function () {
        socket.on("connect", this.onSocketConnected);
    };
    GameMain.prototype.onSocketConnected = function () {
        console.log("connected to server");
    };
    return GameMain;
}(Phaser.Game));
window.onload = function () {
    var game = new GameMain();
};
