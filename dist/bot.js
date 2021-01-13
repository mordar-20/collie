"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var discord_js_1 = require("discord.js");
var Bot = /** @class */ (function () {
    function Bot(options) {
        var _this = this;
        this._commandMethodMap = new Map();
        this._prefix = "!";
        this._token = "";
        this._helpEmbed = new discord_js_1.MessageEmbed()
            .setTitle("bot")
            .setDescription("here are all my commands:")
            .setColor("#fcba03");
        this._token = options.token;
        if (options.prefix != undefined)
            this.usePrefix(options.prefix);
        if (options.helpMessage != undefined) {
            var helpOptions = options.helpMessage;
            if (helpOptions.author != undefined)
                this._helpEmbed.setAuthor(helpOptions.author);
            if (helpOptions.title != undefined)
                this._helpEmbed.setTitle(helpOptions.title);
            if (helpOptions.description != undefined)
                this._helpEmbed.setDescription(helpOptions.description);
            if (helpOptions.Thumbnail != undefined)
                this._helpEmbed.setThumbnail(helpOptions.Thumbnail);
            if (helpOptions.color != undefined)
                this._helpEmbed.setColor(helpOptions.color);
        }
        this._client = new discord_js_1.Client();
        this._client.on("message", function (message) {
            if (message.author.bot)
                return;
            _this.onMessage(message);
        });
        this._client.login(this._token);
    }
    /**
     * Allows custom embed message for help.
     *
     * NOTE: you can not use the setField or setFields methods here.
     *
     * @param embed
     */
    Bot.prototype.setCustomHelpEmbed = function (embed) {
        this._helpEmbed = embed;
    };
    Bot.prototype.usePrefix = function (prefix) {
        this._prefix = prefix;
        return this;
    };
    Bot.prototype.getPrefix = function () {
        return this._prefix;
    };
    Bot.prototype.use = function (command, method) {
        this._commandMethodMap.set(command, method);
    };
    Bot.prototype.useGroup = function (group) {
        var _this = this;
        group
            .getMethods()
            .forEach(function (botMethod, command, Map) {
            _this._commandMethodMap.set(command, botMethod);
        });
    };
    Bot.prototype.onMessage = function (msg) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var prefix, commandBody, args, command;
            var _this = this;
            return __generator(this, function (_b) {
                prefix = msg.content[0];
                this._prefix = prefix;
                commandBody = msg.content.slice(this._prefix.length);
                args = commandBody.split(" ");
                command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                //return because it is not a command
                if (command == undefined)
                    return [2 /*return*/];
                if (command == "help")
                    this.help(msg);
                this._commandMethodMap.forEach(function (botMethod, key, map) {
                    if (key == command)
                        botMethod.method(msg, command, args, _this);
                });
                return [2 /*return*/];
            });
        });
    };
    Bot.prototype.help = function (msg) {
        var _this = this;
        var help = [];
        var groupsAndMethods = new Map();
        this._commandMethodMap.forEach(function (botMethod, key, map) {
            if (!botMethod.group)
                botMethod.group = "ungrouped";
            if (groupsAndMethods.has(botMethod.group)) {
                var val = groupsAndMethods.get(botMethod.group);
                if (val) {
                    val.push(botMethod);
                }
            }
            else {
                var arr = [botMethod];
                groupsAndMethods.set(botMethod.group, arr);
            }
        });
        groupsAndMethods.forEach(function (methods, group) {
            var commands = "";
            methods.forEach(function (method) {
                if (method.args) {
                    commands += "**" + _this._prefix + method.command + "**\n                        args: " + method.args + "\n                        *" + method.description + "*\n                        ";
                }
                else {
                    commands += "**" + _this._prefix + method.command + "**\n                        *" + method.description + "*\n                        ";
                }
            });
            help.push({
                name: group,
                value: ">>> " + commands,
            });
        });
        var channel = msg.channel;
        this._helpEmbed.fields = [];
        this._helpEmbed.addField("\u200B", "\u200B").addFields(help);
        channel.send(this._helpEmbed);
    };
    return Bot;
}());
exports.Bot = Bot;
