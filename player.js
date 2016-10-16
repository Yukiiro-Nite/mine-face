module.exports = (server) => {
  return {
    getCoords : (player, coordsFunction) => {
      server.commands.tpRelative(player);
      server.once(`teleport:${player}`, coordsFunction);
    }
  }
};