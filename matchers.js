module.exports = (server) => {
  return  [
    {
      name: "chat",
      regex:/^<(.*)> ([^-].*)$/g
    },
    {
      name: "command",
      regex:/^<(.*)> -(\w*) (.*)/g,
      onMatch: (match) => {
        server.emit(`command:${match[2]}`, match[1], match[3].split(" "));
      }
    },
    {
      name: 'teleport',
      regex:/^Teleported (\w*) to (\d*\.\d*), (\d*\.\d*), (\d*\.\d*)$/g,
      onMatch: (match) => {
        server.emit(`teleport:${match[1]}`, match[2], match[3], match[4]);
      }
    },
    {
      name: 'login',
      regex: /^(\w*) joined the game$/g,
      onMatch: (match) => {
        server.emit(`login:${match(1)}`)
      }
    },
    {
      name: 'logout',
      regex: /^(\w*) left the game$/g,
      onMatch: (match) => {
        server.emit(`logout:${match(1)}`)
      }
    },
    {
      name: 'clear',
      regex: /^Cleared the inventory of (\w*), removing (\d*) items$/g,
      onMatch: (match) => {
        server.emit(`clear:${match[1]}`, match[2]);
      }
    },
    {
      name: 'hasItem',
      regex: /^(\w*) has (\d*) items that match the criteria$/g,
      onMatch: (match) => {
        server.emit(`hasItem:${match(1)}`, match[2]);
      }
    },
    {
      name: 'noItem',
      regex: /^Could not clear the inventory of (\w*), no items to remove$/g,
      onMatch: (match) => {
        server.emit(`noItem:${match(1)}`);
      }
    }
  ];
};
