/** @format */

import { Client, EmbedFieldData, Message, MessageEmbed } from "discord.js";
import { IBotMethodUser } from "./methods/botMethodUser.interface";
import { ICommandMethod, IWordMethod } from "./methods/botMethod.interface";
import { Group } from "./group/group.class";
import { Command } from "./message/command.class";
import { Response } from "./message/response.class";

export interface IBotOptions {
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

export class Bot implements IBotMethodUser {
    private _commandMethodMap: Map<string, ICommandMethod> = new Map();
    private _wordToMethodMap: Map<string, IWordMethod> = new Map();

    private _prefix = "!";
    private _helpEmbed;
    private _token: string = "";
    private _client: Client;

    constructor(options: IBotOptions) {
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

    /**
     * set command for the bot to listen to
     * @param command
     * @param method
     */
    public use(command: string, method: ICommandMethod): void {
        method.command = command;
        this._commandMethodMap.set(command, method);
    }

    /**
     * set a word that the bot will look for in every message
     * @param word
     * @param method
     */
    public listen(word: string, method: IWordMethod): void {
        method.word = word;
        this._wordToMethodMap.set(word, method);
    }

    /**
     * listen to all words defined in the group
     * @param group
     */
    public listenGroup(group: Group): void {
        group.getListenMethods().forEach((method) => {
            this._wordToMethodMap.set(method.word!, method);
        });
    }

    /**
     * set a group of commands for the bot to listen to
     * @param group
     */
    public useGroup(group: Group): void {
        group
            .getMethods()
            .forEach((botMethod: ICommandMethod, command: string) => {
                this._commandMethodMap.set(command, botMethod);
            });
    }

    private async onMessage(msg: Message): Promise<void> {
        this.checkMethods(msg);
        this.checkListeners(msg);
    }

    private checkListeners(msg: Message) {
        this._wordToMethodMap.forEach((botMethod: IWordMethod) => {
            if (msg.content.includes(botMethod.word!)) {
                const response = new Response(msg);
                botMethod.method(botMethod.word, response);
            }
        });
    }

    private checkMethods(msg: Message) {
        const prefix = msg.content[0];

        //not the correct prefix
        if (this._prefix != prefix) return;

        const commandBody = msg.content.slice(this._prefix.length);
        const regex = / +(?=(?:(?:[^"]*"){2})*[^"]*$)/g;
        const args = commandBody.split(regex);

        const commandString = args.shift()?.toLowerCase();

        //return because it is not a command
        if (commandString == undefined) return;
        if (commandString == "help") this.help(msg);

        this._commandMethodMap.forEach((botMethod, key) => {
            if (key == commandString) {
                const command = new Command(commandString, args, this);
                const response = new Response(msg);
                botMethod.method(command, response);
            }
        });
    }

    //groups all methods together in a map by group
    private groupMethods() {
        let groupsAndMethods = new Map<string, ICommandMethod[]>();
        this._commandMethodMap.forEach((botMethod, key, map) => {
            if (!botMethod.group) botMethod.group = "ungrouped";
            if (groupsAndMethods.has(botMethod.group)) {
                let val = groupsAndMethods.get(botMethod.group);
                if (val) {
                    val.push(botMethod);
                }
            } else {
                let arr: ICommandMethod[] = [botMethod];
                groupsAndMethods.set(botMethod.group, arr);
            }
        });

        return groupsAndMethods;
    }

    private help(msg: Message): void {
        const help: EmbedFieldData[] = [];

        //add all commands to help message_embed
        let groupsAndMethods = this.groupMethods();

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

        //add all words the bot listens for to the help_embed
        let words = "";
        this._wordToMethodMap.forEach((method) => {
            words += `**${method.word}**
            *${method.description}*
            `;
        });

        help.push({ name: "words I listen for:", value: ">>> " + words });

        const channel = msg.channel;

        this._helpEmbed.fields = [];
        this._helpEmbed.addField("\u200B", "\u200B").addFields(help);

        channel.send(this._helpEmbed);
    }
}
