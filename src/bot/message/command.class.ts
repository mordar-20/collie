/** @format */

import { Message } from "discord.js";
import { IArg } from "../args/args.class";
import { Bot } from "../bot.class";

export class Command {
    private _command: string;
    private _args: Map<string, string> = new Map();
    private _botInstance: Bot;

    constructor(command: string, args: string[], botInstance: Bot) {
        this._command = command;
        this._botInstance = botInstance;

        this.parseArgs(args);
    }

    private parseArgs(args: string[]) {
        const argValMap = new Map<string, string>();

        for (let i = 0; i < args.length; i++) {
            argValMap.set(
                args[i],
                args[i + 1].replace(new RegExp('"', "g"), "")
            );
            i++;
        }

        this._args = argValMap;
    }

    /**
     * returns all arguments
     */
    getArgs() {
        return this._args;
    }

    /**
     * returns argument value where argument name is key
     * returns undefined if not given
     * @param key
     */
    getArg(key: string) {
        return this._args.get(key);
    }

    getCommand() {
        return this._command;
    }

    getBot() {
        return this._botInstance;
    }
}
