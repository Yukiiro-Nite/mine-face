var config = require('./config.json');
var EventEmitter = require('events');
var commandsUtil = require('./commands.js');
var Matchers = require('./matchers.js');
module.exports = (input, io) => {
  class ServerEmitter extends EventEmitter {
    constructor(){
      super();
      var that = this;
      this.commands = commandsUtil(io);
      this.matchers = Matchers(this);
      input.on('line', (line)=>{
        var args = line.split(": ");
        var info = args[0].split(" ");
        var details = args.slice(1).join(": ");
        that.emit('line', info[0], info.slice(1).join(" "), details);
      });
      this.on('line', (timestamp, type, details) =>{
        console.log(`${timestamp} ${details}`);
        that.matchers.forEach((matcher)=>{
          let result = matcher.regex.exec(details);
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