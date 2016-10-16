const spawn = require('child_process').spawn;
const readline = require('readline');
const fs = require('fs');

const config = require('./config.json');
const PluginHandler = require('./pluginHandler.js');
const Server = require('./server.js');

const getLocalMinecraftFile = () => {
  return fs.readdirSync('./')
    .filter(file => {
      return file.startsWith('minecraft_server') && file.endsWith('.jar');
    })[0];
};

const serverJarName = process.argv[2] || config.serverJarName || getLocalMinecraftFile();
const minecraftServer = spawn('java', ['-jar', serverJarName, 'nogui']);

const minecraftOut = readline.createInterface({
  input: minecraftServer.stdout
});

const processIn = readline.createInterface({
  input: process.stdin
});

minecraftOut.on('close', ()=>{
  console.log("Minecraft Server closed!");
  processIn.close();
});

processIn.on('line', input => {
  minecraftServer.stdin.write(`${input}\r\n`);
});

const server = Server(minecraftOut, minecraftServer.stdin);
const pluginHandler = PluginHandler(server);

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

server.on('command:help', (player, args) => {
  let helpText = [{text:'---< Command Help >---', color: 'green'}, {text:'\n',color:'white',underlined:'false'}];
  if(!args[0]) {
    pluginHandler.getCommandNames().forEach(commandName => {
      helpText.push({
        text:`-${commandName}`,
        clickEvent:{action:"run_command", value:`-help ${commandName}`},
        hoverEvent:{action:"show_text", value:{text:`click to see help for -${commandName}`}},
        color:'white',
        underlined:'false'
      });
      helpText.push('\n');
    });
  } else {
    pluginHandler.getPluginNamesForCommand(args[0]).forEach(pluginName => {
      if(pluginHandler.plugins[pluginName] && pluginHandler.plugins[pluginName].help) {
        helpText.push({text:`${pluginName}: ${args[0]}\n`, color:'dark_green'});
        helpText.push('  ');
        helpText.push(pluginHandler.plugins[pluginName].help(args[0]));
        helpText.push('\n');
      } else {
        helpText.push({text:`${pluginName}: ${args[0]}\n`, color:'dark_green'});
        helpText.push('  ');
        helpText.push({
          text:"No available help text.",
          color:'white',
          underlined:'false'
        });
        helpText.push('\n');
      }
    });
  }
  server.commands.tellraw(player, helpText);
});

pluginHandler.loadPlugins();