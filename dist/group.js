"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
var Group = /** @class */ (function () {
    function Group(name) {
        this._name = name;
        this._commandBotMethodMap = new Map();
    }
    Group.prototype.use = function (command, method) {
        method.command = command;
        method.group = this.getName();
        this._commandBotMethodMap.set(command, method);
    };
    Group.prototype.getMethods = function () {
        return this._commandBotMethodMap;
    };
    Group.prototype.getName = function () {
        return this._name;
    };
    return Group;
}());
exports.Group = Group;
