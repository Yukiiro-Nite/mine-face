const https = require('https');
module.exports = (server) => {
  server.on('command:whois', (player, args) => {
    if (args.length == 0) { // return if there aren't any args
      server.commands.tellraw(player, {text: 'Please specify a player name! (eg. -whois player1)', color: 'red'});
    } else {
      get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`).then((playerStats)=>{
          get(`https://api.mojang.com/user/profiles/${playerStats.id}/names`).then((playerNames)=>{
            server.commands.tellraw(player, {text: playerNames.map(name => name.name).join(', ') , color: 'gold'});
          })
        })
    }
  });

  const get = ( url ) => {
    return new Promise(function(resolve, reject){
      https.get(url, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(`Invalid content-type.\n` +
            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          // consume response data to free up memory
          res.resume();
          reject(error);
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            reject(e.message);
          }
        });
      }).on('error', (e) => {
        reject(e.message);
      });
    });
  };

  const help = (commandName) => {
    switch (commandName){
      case 'test':
        return {
          text: 'tells you who someone has been',
          color:'white',
          underlined:'false'
        };
    }
  };

  return {
    help
  }
};
