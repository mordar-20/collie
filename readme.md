<a href="https://www.buymeacoffee.com/beathan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" height="41" width="174"></a>


# what it has to offer

This framework focusses on the infrastructure. It uses discord.js and allows for easy and dynamic constructing of the help command.
This is possible by regestering methods to the bot, in a similar fashion to using routes in express. It also allows for more readable and organized code.
Furthermore it takes care of checking wether a message is a command or not. This saves time for you as developer to work on the actual functionality of the bot, rather than it's infrastructure.

And now: let me explain how you would go about using this framework.

# content

-   [installation](#installation)
-   [set up the bot](#to-initailize-this-bot-the-following-code-can-be-used)
-   [single commands](#command-using-botuse)
-   [command groups](#command-using-botuse)

## installation

To install as a package you can use yarn:

```bash
yarn add @beathan/collie
```

or npm:

```bash
npm i @beathan/collie
```

## To initailize this bot the following code can be used

```ts
const bot = new Bot({
    token: process.env.BOT_TOKEN as string,
    helpMessage: {
        author: "author-name",
        title: "bot-name",
        description: "here are all my commands:",
        Thumbnail: "url-to-thumnail",
        color: "#fcba03",
    },
});
```

### command using bot.use

With this example code the bot listens for the 'emoji' action, it will then respond with the emoji given as the argument 'emoji'.
If the argument is invalid (not given) it wil respond by replying an error message.

```ts
bot.use("emoji", {
    description: "gives the emoji as a reaction",
    args: new Args([{ name: "emoji", optional: false }]),
    method: (command: Command, response: Reponse) => {
        const emoji = command.getArg("emoji");

        if (emoji) {
            response.setType(MessageType.React).setMessage(emoji).send();
        } else {
            response
                .setType(MessageType.Reply)
                .setMessage("no valid arguments given")
                .send();
        }
    },
});
```

this is great for small bots, but for bigger projects it can be usefull to group commands.

### commands using bot.useGroup

```ts
const testgroup = new Group("test commands!");

testgroup.use("emoji", {
    description: "gives the emoji as a reaction",
    args: new Args([{ name: "emoji", optional: false }]),
    method: (command: Command, response: Reponse) => {
        const emoji = command.getArg("emoji");

        if (emoji) {
            response.setType(MessageType.React).setMessage(emoji).send();
        } else {
            response
                .setType(MessageType.Reply)
                .setMessage("no valid arguments given")
                .send();
        }
    },
});

testgroup.use("test2", {
    description: "say test2",
    method: (command: Command, response: Response) => {
        response.setType(MessageType.ChannelEmbed).setTitle("test2!").send();
    },
});

bot.useGroup(testgroup);
```

Ideally one would seperate the group, methods and use statement into seperate files/folders. One way to do this is:  
--src  
----controller  
--------x.controller.ts  
----group  
--------x.group.ts

where in our example the content of the files would look like this:  
test.group.ts

```ts
import { methods } from "location-of-methods";

const testgroup = new Group("test commands!");

testgroup.use("emoji", {
    description: "gives the emoji as a reaction",
    args: new Args([{ name: "emoji", optional: false }]),
    method: methods.emoji(),
});

testgroup.use("test2", {
    description: "say test2",
    method: methods.test2(),
});
```

test.controller.ts

```ts
export const methods = {
    test2: (command: Command, response: Response) => {
        response.setType(MessageType.ChannelEmbed).setTitle("test2!").send();
    },

    emoji: (command: Command, response: Reponse) => {
        const emoji = command.getArg("emoji");

        if (emoji) {
            response.setType(MessageType.React).setMessage(emoji).send();
        } else {
            response
                .setType(MessageType.Reply)
                .setMessage("no valid arguments given")
                .send();
        }
    },
};
```

and finally our main.ts file:

```ts
import { testgroup } from "location-of-group";

bot.useGroup(testgroup);
```

the bot now knows wich group the methods belong to and shall show them grouped when the _help_ command is used.
