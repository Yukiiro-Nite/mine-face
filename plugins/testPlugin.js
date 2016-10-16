module.exports = (server) => {
  server.on('command:test', (player, args) => {
    console.log(`test command fired with args: ${args.join(" ")}`);
  });

  const help = (commandName) => {
    switch (commandName){
      case 'test':
        return {
          text: 'A test command that prints args to the server console.',
          color:'white',
          underlined:'false'
        };
    }
  };
  
  return {
    help
  }
};