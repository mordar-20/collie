/** @format */
import { BotMethod, BotMethodUser } from "./bot";
export declare class Group implements BotMethodUser {
    private _commandBotMethodMap;
    private _name;
    constructor(name: string);
    use(command: string, method: BotMethod): void;
    getMethods(): Map<string, BotMethod>;
    getName(): string;
}
