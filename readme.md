# what it has to offer
This framework focusses on the infrastructure. It uses discord.js and allows for easy and dynamic constructing of the help command.
This is possible by regestering methods to the bot, in a similar fashion to using routes in express. It also allows for more readable and organized code.
Furthermore it takes care of checking wether a message is a command or not. This saves time for you as developer to work on the actual functionality of the bot, rather than it's infrastructure.

And now: let me explain how you would go about using this framework.

# content
* [installation](#installation)
* [set up the bot](#to-initailize-this-bot-the-following-code-can-be-used)
* [single commands](#command-using-botuse)
* [command groups](#command-using-botuse)

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
```ts
bot.use("test-command", {
    description: "shows a test message",
    method: (msg: Message) => {
        msg.reply("hello, this is a test message");
    },
});
```
It is worth noting that the bot passes more than just the message as an argument. It passes the following arguments to a method:
* 'msg' of type Message
* 'command' of type string
* 'args' of type string[]
* 'this' wich is the refference to the bot

this could be usefull when for example you would want to add methods dynamically. You could just use this.use() like you would normally with your bot.

this is great for small bots, but for bigger projects it can be usefull to group commands.

### commands using bot.useGroup
```ts
const testgroup = new Group("test commands!");

testgroup.use("test1", {
  description: "say test1",
  method: (msg: Message) => {
    msg.reply("test1")
  }
});

testgroup.use("test2", {
  description: "say test2",
  method: (msg: Message) => {
    msg.reply("test2")
  }
});


bot.useGroup(testgroup)
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

export const testgroup = new Group("test commands!");

testgroup.use("test1", {
  description: "say test1",
  method: methods.test1,
});

testgroup.use("test2", {
  description: "say test2",
  method: methods.test2,
});
```
test.controller.ts
```ts
export const methods = {
  test1: (msg: Message) => {
    msg.reply("test1")
  },
  
  test2: (msg: Message) => {
    msg.reply("test2")
  },
}
```
and finally our main.ts file:
```ts
import { testgroup } from "location-of-group";

bot.useGroup(testgroup);
```

the bot now knows wich group the methods belong to and shall show them grouped when the *help* command is used.
