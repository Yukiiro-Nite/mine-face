var config = require('./config.json');
var EventEmitter = require('events');
var commandsUtil = require('./commands.js');
module.exports = (input, io) => {
  class ServerEmitter extends EventEmitter {
    constructor(){
      super();
      var that = this;
      this.commands = commandsUtil(io);
      this.matchers = [
        {
          name: "chat",
          regex:/^<(.*)> ([^-].*)$/g
        },
        {
          name: "command",
          regex:/^<(.*)> -(\w*) (.*)/g,
          onMatch: (match) => {
            that.emit(`command:${match[2]}`, match[1], match[3].split(" "));
          }
        }
      ];
      input.on('line', (line)=>{
        var args = line.split(": ");
        var info = args[0].split(" ");
        var details = args.slice(1).join(": ");
        that.emit('line', info[0], info.slice(1).join(" "), details);
      });
      this.on('line', (timestamp, type, details) =>{
        console.log(`${timestamp} ${details}`);
        that.matchers.forEach((matcher)=>{
          var result = matcher.regex.exec(details);
          if(result){
            matcher.name && that.emit(matcher.name, ...result);
            matcher.onMatch && matcher.onMatch(result);
          }
        });
      });
    }
  }

  return new ServerEmitter();
};