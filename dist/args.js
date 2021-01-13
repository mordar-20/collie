"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Args = void 0;
var Args = /** @class */ (function () {
    function Args(args) {
        this.args = args;
    }
    Args.prototype.toString = function () {
        var _this = this;
        var string = "";
        this.args.forEach(function (arg) {
            string += arg.optional ? arg.name + "?" : arg.name;
            if (_this.args.length - 1 != _this.args.indexOf(arg))
                string += ", ";
        });
        string = "[" + string + "]";
        return string;
    };
    return Args;
}());
exports.Args = Args;
