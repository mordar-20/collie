/** @format */

import {
    EmbedField,
    Message,
    MessageEmbed,
    MessageEmbedImage,
} from "discord.js";

interface sendData {
    title?: string;
    author?: string;
    description?: string;
    footer?: string;
    image?: string;
}

export enum MessageType {
    Reply,
    ReplyEmbed,
    Channel,
    ChannelEmbed,
    React,
}

export class Response {
    private _msg: Message;
    private _embed: MessageEmbed;
    private _type: MessageType;

    private _stringMessage: string = "";
    private _imageUrl: string = "";

    constructor(msg: Message) {
        this._msg = msg;

        this._embed = new MessageEmbed();

        this._type = MessageType.Reply;
    }

    setType(type: MessageType) {
        this._type = type;
        return this;
    }

    setMessage(message: string) {
        this._stringMessage = message;
        return this;
    }

    /**
     * set title for when using embed
     * @param title
     */
    setTitle(title: string): Response {
        this._embed.title = title;
        return this;
    }

    /**
     * set author for when using embed
     * @param author
     */
    setAuthor(author: string): Response {
        this._embed.setAuthor(author);
        return this;
    }

    /**
     * set description for when using embed
     * @param description
     */
    setDescription(description: string) {
        this._embed.setDescription(description);
        return this;
    }

    /**
     * set footer for when sending embed
     * @param footer
     */
    setFooter(footer: string) {
        this._embed.setFooter(footer);
        return this;
    }

    /**
     * sets image url
     * @param imageUrl
     */
    setImage(imageUrl: string) {
        this._imageUrl = imageUrl;
        this._embed.setImage(imageUrl);
        return this;
    }

    //validates sendData object
    private validateObject(ob: sendData) {
        if (ob.author) this._embed.setAuthor(ob.author);
        if (ob.description) this._embed.setDescription(ob.description);
        if (ob.title) this._embed.setTitle(ob.title);
        if (ob.footer) this._embed.setFooter(ob.footer);
        if (ob.image) this._embed.setImage(ob.image);
    }

    /**
     * set values for sending embed message
     * @param object
     */
    setValues(object?: sendData) {
        if (object) this.validateObject(object);
    }

    /**
     * sends the message
     */
    send() {
        switch (this._type) {
            case MessageType.ChannelEmbed:
                this.channelSend(this._embed);
                break;
            case MessageType.Channel:
                this.channelSend(this._stringMessage);
                break;
            case MessageType.Reply:
                this.reply(this._stringMessage);
                break;
            case MessageType.ReplyEmbed:
                this.reply(this._embed);
                break;
            case MessageType.React:
                this.react(this._stringMessage);
                break;
        }
    }

    //send to channel
    private channelSend(msg: MessageEmbed | string) {
        const channel = this._msg.channel;
        if (msg instanceof MessageEmbed) {
            channel.send(msg);
        } else if (this._imageUrl.length > 0) {
            channel.send(msg, {
                files: [this._imageUrl],
            });
        } else {
            channel.send(msg);
        }
    }

    //reply to msg
    private reply(msg: string | MessageEmbed) {
        if (msg instanceof MessageEmbed) {
            this._msg.reply(msg);
        } else if (this._imageUrl.length > 0) {
            this._msg.reply(msg, {
                files: [this._imageUrl],
            });
        } else {
            this._msg.reply(msg);
        }
    }

    //react to message
    private react(react: string) {
        this._msg.react(react);
    }

    /**
     * returns discord.js Message object
     */
    getDiscordMessageObject() {
        return this._msg;
    }
}
