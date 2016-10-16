# mine-face

mine-face is a plugin framework for Minecraft built in node.js

**Easy To Use**
Just download the repo and extract the contents next to your minecraft_server.jar file then run the following in the command line:
```sh
node mine-face.js
```

**Easy To Write Plugins**
Here's an example plugin that greets the player when they log in:
```js
module.exports = (server) => {
  server.on('login', (line, player) => {
    server.commands.tellraw(player, {text:`Welcome, ${player}!`, color: 'white'});
  });
};
```
