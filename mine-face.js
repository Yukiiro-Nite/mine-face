var spawn = require('child_process').spawn;
var readline = require('readline');
var config = require('./config.json');
var PluginHandler = require('./pluginHandler.js');
var Server = require('./server.js');

var serverJarName = process.argv[2] || config.serverJarName || 'minecraft_server.jar';
var minecraftServer = spawn('java', ['-jar', serverJarName, 'nogui']);

var minecraftOut = readline.createInterface({
  input: minecraftServer.stdout
});

var processIn = readline.createInterface({
  input: process.stdin
});

minecraftOut.on('close', ()=>{
  console.log("Minecraft Server closed!");
  processIn.close();
});

processIn.on('line', input => {
  minecraftServer.stdin.write(`${input}\r\n`);
});

var server = Server(minecraftOut, minecraftServer.stdin);
var pluginHandler = PluginHandler(server);

server.on('command:plugins', (player) => {
  server.commands.tellraw(player, {text: `Plugins: ${Object.keys(pluginHandler.plugins).join(", ")}`, color: "green"});
});

server.on('command:reloadplugins', (player) => {
  if(server.player.isOp(player)) {
    server.commands.tellraw(player, {text: 'Reloading plugins!', color: 'green'});
    pluginHandler.reloadPlugins();
    server.commands.tellraw(player, {text: 'Reloading completed!', color: 'green'});
  } else {
    server.commands.tellraw(player, {text: `You don't have permissions for this command!`, color: 'red'});
  }
});

pluginHandler.loadPlugins();