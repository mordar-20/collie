/** @format */
import { Message, MessageEmbed } from "discord.js";
import { Args } from "./args";
import { Group } from "./group";
export interface BotMethodUser {
    use(command: string, method: BotMethod): void;
}
export interface BotMethod {
    /**
     * ```
     * args: new Args([
     *     {name: "url", optional: false}
     * ])
     * ```
     */
    command?: string;
    group?: string;
    args?: Args;
    method: Function;
    description: string;
}
export interface BotOptions {
    token: string;
    prefix?: string;
    helpMessage?: {
        author?: string;
        title?: string;
        description?: string;
        Thumbnail?: string;
        color?: string;
    };
}
export declare class Bot implements BotMethodUser {
    private _commandMethodMap;
    private _prefix;
    private _helpEmbed;
    private _token;
    private _client;
    constructor(options: BotOptions);
    /**
     * Allows custom embed message for help.
     *
     * NOTE: you can not use the setField or setFields methods here.
     *
     * @param embed
     */
    setCustomHelpEmbed(embed: MessageEmbed): void;
    usePrefix(prefix: string): Bot;
    getPrefix(): string;
    use(command: string, method: BotMethod): void;
    useGroup(group: Group): void;
    onMessage(msg: Message): Promise<void>;
    private help;
}
