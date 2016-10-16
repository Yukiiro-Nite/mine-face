const fs = require('fs');
module.exports = (server) => {
  return {
    getCoords : (player, coordsFunction) => {
      server.commands.tpRelative(player);
      server.once(`teleport:${player}`, coordsFunction);
    },
    isOp: (player) => {
      let ops = JSON.parse(fs.readFileSync('./ops.json'));
      return ops.find( op => {return op.name == player;});
    }
  }
};