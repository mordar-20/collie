/** @format */

import { BotMethod } from "../methods/botMethod";
import { BotMethodUser } from "../methods/botMethodUser";

export class Group implements BotMethodUser {
    private _commandBotMethodMap: Map<string, BotMethod>;
    private _name: string;

    constructor(name: string) {
        this._name = name;
        this._commandBotMethodMap = new Map();
    }

    public use(command: string, method: BotMethod) {
        method.command = command;
        method.group = this.getName();
        this._commandBotMethodMap.set(command, method);
    }

    public getMethods(): Map<string, BotMethod> {
        return this._commandBotMethodMap;
    }

    public getName(): string {
        return this._name;
    }
}
