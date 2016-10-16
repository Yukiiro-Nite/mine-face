module.exports = (server) => {
  return  [
    {
      name: "chat",
      regex:/^<(.*)> ([^-].*)$/
    },
    {
      name: "command",
      regex:/^<(.*)> -(\w*) (.*)$/,
      onMatch: (match) => {
        server.emit(`command:${match[2]}`, match[1], match[3].split(" "));
      }
    },
    {
      name: "command",
      regex:/^<(.*)> -(\w*)(\s*)?$/,
      onMatch: (match) => {
        server.emit(`command:${match[2]}`, match[1], []);
      }
    },
    {
      name: 'teleport',
      regex:/^Teleported (\w*) to (\d*\.\d*), (\d*\.\d*), (\d*\.\d*)$/,
      onMatch: (match) => {
        server.emit(`teleport:${match[1]}`, match[2], match[3], match[4]);
      }
    },
    {
      name: 'login',
      regex: /^(\w*) joined the game$/,
      onMatch: (match) => {
        server.emit(`login:${match[1]}`);
        server.players[match[1]] = {online: true};
      }
    },
    {
      name: 'logout',
      regex: /^(\w*) left the game$/,
      onMatch: (match) => {
        server.emit(`logout:${match[1]}`);
        delete server.players[match[1]];
      }
    },
    {
      name: 'clear',
      regex: /^Cleared the inventory of (\w*), removing (\d*) items$/,
      onMatch: (match) => {
        server.emit(`clear:${match[1]}`, match[2]);
      }
    },
    {
      name: 'hasItem',
      regex: /^(\w*) has (\d*) items that match the criteria$/,
      onMatch: (match) => {
        server.emit(`hasItem:${match[1]}`, match[2]);
      }
    },
    {
      name: 'noItem',
      regex: /^Could not clear the inventory of (\w*), no items to remove$/,
      onMatch: (match) => {
        server.emit(`noItem:${match[1]}`);
      }
    },
    {
      name: 'setWorldSpawn',
      regex: /^\[(\w*): Set the world spawn point to \((\d*), (\d*), (\d*)\)]$/
    }
  ];
};
