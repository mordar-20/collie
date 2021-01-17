/** @format */

import { ICommandMethod, IWordMethod } from "../methods/botMethod.interface";
import { IBotMethodUser } from "../methods/botMethodUser.interface";

export class Group implements IBotMethodUser {
    private _wordToMethodMap: Map<string, IWordMethod>;
    private _commandBotMethodMap: Map<string, ICommandMethod>;
    private _name: string;

    constructor(name: string) {
        this._name = name;
        this._commandBotMethodMap = new Map();
        this._wordToMethodMap = new Map();
    }

    public listen(word: string, method: IWordMethod): void {
        method.word = word;
        this._wordToMethodMap.set(word, method);
    }

    public getListenMethods(): Map<string, IWordMethod> {
        return this._wordToMethodMap;
    }

    public use(command: string, method: ICommandMethod) {
        method.command = command;
        method.group = this.getName();
        this._commandBotMethodMap.set(command, method);
    }

    public getMethods(): Map<string, ICommandMethod> {
        return this._commandBotMethodMap;
    }

    public getName(): string {
        return this._name;
    }
}
