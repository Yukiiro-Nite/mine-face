const fs = require('fs');
module.exports = (server) => {
  const defaultConfig = {
    maxHomes: 5,
    homes: {}
  };
  let homesConfig;
  server.on('command:home', (player, args) => {
    if(args.length == 0){ // return if there aren't any args
      server.commands.tellraw(player, {text: 'Please specify a home name! (eg. -home home1)', color: 'red'});
      return;
    } else if(!homesConfig.homes[player]){ // return if the player doesn't have any homes
      server.commands.tellraw(player, {text: `You don't have any homes! try using: -sethome home1`, color: 'red'});
      return;
    } else if(!homesConfig.homes[player][args[0]]){ // return if the player hasn't set the specified home
      server.commands.tellraw(player, {text: `You haven't set ${args[0]}! try using: -sethome ${args[0]}`, color: 'red'});
      return;
    } else {
      server.commands.tp(player, ...homesConfig.homes[player][args[0]]);
    }
  });

  server.on('command:sethome', (player, args) => {
    if(args.length == 0){ // return if there aren't any args
      server.commands.tellraw(player, {text: 'Please specify a home name (eg. -sethome home1)', color: 'red'});
      return;
    } else if(!homesConfig.homes[player]){ // if the player hasn't got any homes
      homesConfig.homes[player] = {}; // give them an empty object to populate
    } else if(Object.keys(homesConfig.homes[player]).length == homesConfig.maxHomes) { // return if the player has the max number of homes.
      server.commands.tellraw(player, {text: `You have the max number (${homesConfig.maxHomes}) of homes set!`, color: 'red'});
      server.commands.tellraw(player, {text: `Try using -removehome home1`, color: 'red'});
      return;
    }
    server.player.getCoords(player, (x, y, z) => { //get the player's coords so we can save their home.
      homesConfig.homes[player][args[0]] = [x, y, z];
      save();
      server.commands.tellraw(player, {text: `Home: ${args[0]} successfully set to (${x}, ${y}, ${z})!`, color: 'green'});
    });
  });

  server.on('command:removehome', (player, args) => {
    if(args.length == 0){ // return if there aren't any args
      server.commands.tellraw(player, {text: 'Please specify a home name (eg. -removehome home1)', color: 'red'});
      return;
    } else if(!homesConfig.homes[player]){ // return if the player doesn't have any homes
      server.commands.tellraw(player, {text: `You don't have any homes! try using: -sethome home1`, color: 'red'});
      return;
    } else if(!homesConfig.homes[player][args[0]]){ // return if the player hasn't set the specified home
      server.commands.tellraw(player, {text: `You haven't set ${args[0]}! try using: -sethome ${args[0]}`, color: 'red'});
      return;
    } else {
      delete homesConfig.homes[player][args[0]];
      save();
      server.commands.tellraw(player, {text: `Home: ${args[0]} successfully removed!`, color: 'green'});
    }
  });

  server.on('command:listhomes', (player) => {
    let message = [{text: 'Homes: ', color: 'green'}];
    Object.keys(homesConfig.homes[player]).forEach( home => {
      message.push({text: home, underlined: true, clickEvent:{action:"suggest_command",value:`-home ${home}`}});
      message.push(" ");
    });
    server.commands.tellraw(player, message);
  });



  fs.readFile('./plugins/home-config.json', (err, data) => {
    if(err) {
      homesConfig = defaultConfig;
      save();
      return;
    }
    homesConfig = JSON.parse(data);
  });

  const save = () => {
    fs.writeFile('./plugins/home-config.json', JSON.stringify(homesConfig));
  };
};