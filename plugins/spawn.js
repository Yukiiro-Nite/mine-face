const fs = require('fs');
module.exports = (server) => {
  let spawnCoords;
  server.on('command:spawn', (player) => {
    spawnCoords && server.commands.tp(player, ...spawnCoords);
    !spawnCoords && server.commands.tellraw(player, {text: 'No spawn point set!', color: 'red'});
  });

  server.on('setWorldSpawn', (line, player, x, y, z) => {
    spawnCoords = [x, y, z];
    fs.writeFile('./plugins/spawn-config.json', JSON.stringify(spawnCoords));
  });

  fs.readFile('./plugins/spawn-config.json', (err, data) => {
    if(err) return;
    spawnCoords = JSON.parse(data);
  });

  const help = (commandName) => {
    switch (commandName){
      case 'spawn':
        return {
          text: `Teleports the player to the world spawn. (eg: -spawn)`,
          color:'white',
          underlined:'false'
        };
    }
  };
};