/** @format */

import { Message } from "discord.js";
import { IArg } from "./args/args";
import { Bot } from "./bot";

export class Command {
    private _command: string;
    // private _args: Map<IArg, string>;
    private _botInstance: Bot;

    constructor(command: string, args: string[], botInstance: Bot) {
        this._command = command;
        this._botInstance = botInstance;

        this.parseArgs(args);
    }

    private parseArgs(args: string[]) {
        console.log(args);
    }

    getArgs() {}

    getArg(key: string) {}

    getCommand() {
        return this._command;
    }

    getBot() {
        return this._botInstance;
    }
}
