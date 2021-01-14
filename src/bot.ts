/** @format */

import { Client, EmbedFieldData, Message, MessageEmbed } from "discord.js";
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

export class Bot implements BotMethodUser {
    private _commandMethodMap: Map<string, BotMethod> = new Map();
    private _prefix = "!";
    private _helpEmbed;
    private _token: string = "";
    private _client: Client;

    constructor(options: BotOptions) {
        this._helpEmbed = new MessageEmbed()
            .setTitle("bot")
            .setDescription("here are all my commands:")
            .setColor("#fcba03");

        this._token = options.token;
        if (options.prefix != undefined) this.usePrefix(options.prefix);
        if (options.helpMessage != undefined) {
            const helpOptions = options.helpMessage;
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

        this._client = new Client();

        this._client.on("message", (message: Message) => {
            if (message.author.bot) return;
            this.onMessage(message);
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
    public setCustomHelpEmbed(embed: MessageEmbed) {
        this._helpEmbed = embed;
    }

    public usePrefix(prefix: string): Bot {
        this._prefix = prefix;
        return this;
    }

    public getPrefix(): string {
        return this._prefix;
    }

    public use(command: string, method: BotMethod): void {
        method.command = command;
        this._commandMethodMap.set(command, method);
    }

    public useGroup(group: Group): void {
        group
            .getMethods()
            .forEach((botMethod: BotMethod, command: string, Map) => {
                this._commandMethodMap.set(command, botMethod);
            });
    }

    public async onMessage(msg: Message): Promise<void> {
        const prefix = msg.content[0];
        this._prefix = prefix;

        const commandBody = msg.content.slice(this._prefix.length);
        const args = commandBody.split(" ");
        const command = args.shift()?.toLowerCase();

        //return because it is not a command
        if (command == undefined) return;
        if (command == "help") this.help(msg);

        this._commandMethodMap.forEach((botMethod, key, map) => {
            if (key == command) botMethod.method(msg, command, args, this);
        });
    }

    private help(msg: Message): void {
        const help: EmbedFieldData[] = [];

        let groupsAndMethods = new Map<string, BotMethod[]>();
        this._commandMethodMap.forEach((botMethod, key, map) => {
            if (!botMethod.group) botMethod.group = "ungrouped";
            if (groupsAndMethods.has(botMethod.group)) {
                let val = groupsAndMethods.get(botMethod.group);
                if (val) {
                    val.push(botMethod);
                }
            } else {
                let arr: BotMethod[] = [botMethod];
                groupsAndMethods.set(botMethod.group, arr);
            }
        });

        groupsAndMethods.forEach((methods, group) => {
            let commands = "";
            methods.forEach((method) => {
                if (method.args) {
                    commands += `**${this._prefix}${method.command}**
                        args: ${method.args}
                        *${method.description}*
                        `;
                } else {
                    commands += `**${this._prefix}${method.command}**
                        *${method.description}*
                        `;
                }
            });

            help.push({
                name: group,
                value: ">>> " + commands,
            });
        });

        const channel = msg.channel;

        this._helpEmbed.fields = [];
        this._helpEmbed.addField("\u200B", "\u200B").addFields(help);

        channel.send(this._helpEmbed);
    }
}
