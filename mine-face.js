var spawn = require('child_process').spawn;
var readline = require('readline');
var EventEmitter = require('events');
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
pluginHandler.loadPlugins();


// minecraftOut.on('line', input => {
//   var args = input.split(": ");
//   var info = args[0].split(" ");
//   var details = args.slice(1).join(": ");
//   mineFace.emit('line', info[0], info.slice(1).join(" "), details);
//   //console.log(input);
// }).on('close', () => {
//   console.log("Minecraft Server closed!");
//   processIn.close();
// });
//
// processIn.on('line', input => {
//   //minecraftServer.stdin.write(`${input}\r\n`);
//   sendCommand(input);
// });
//
// var sendCommand = function(string){
//   minecraftServer.stdin.write(`${string}\r\n`);
// };
//
// var getCoords = function(user, callback){
//   sendCommand(`tp ${user} ~ ~ ~`);
//   mineFace.once(`Teleported:${user}`, (x,y,z) => {
//     callback(x,y,z);
//   });
// };
//
// class MineFace extends EventEmitter {}
// const mineFace = new MineFace();
// var commandDelimiter = '-';
// mineFace.on('line', (timestamp, type, details) => {
//   console.log(details);
//   var args = details.split(" ");
//   //check if the line is chat
//   if(args[0].indexOf('<') == 0 && args[0].indexOf('>') == args[0].length - 1){
//     var username = args[0].substr(1,args[0].length - 2);
//     if(args[1].indexOf(commandDelimiter) == 0){
//       var commandName = args[1].substr(1);
//       mineFace.emit('command', commandName, username, args.slice(2));
//       mineFace.emit(`command:${commandName}`,username, args.slice(2));
//     } else {
//       mineFace.emit('chat', username, args.slice(1).join(" "));
//     }
//   } else if(args[0] == 'Teleported'){
//     var username = args[1];
//     var coords = [args[3].replace(',',''), args[4].replace(',',''), args[5]];
//     if(coords[0] && coords[1] && coords[2]) {
//       mineFace.emit('Teleported', username, coords[0], coords[1], coords[2]);
//       mineFace.emit(`Teleported:${username}`, coords[0], coords[1], coords[2]);
//     }
//   }
//   else {
//     console.log(timestamp, details);
//   }
// });
//
// mineFace.on('chat', (user, text) => {
//   console.log(`${user}: ${text}`);
// });
//
// mineFace.on('command:echo', (user, args) => {
//   console.log(`${user} used the echo command with args: ${args.join(" ")}`);
// });
//
// mineFace.on('command:derp', (user, args) => {
//   getCoords(user, (x,y,z) => {
//     sendCommand(`say ${user} @ ${x}, ${y}, ${z}`);
//   });
// });