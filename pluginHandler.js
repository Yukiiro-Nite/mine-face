module.exports = (server) => {
  const fs = require('fs');

  let plugins = {};
  let defaultState;
  let commandParents;

  const getDefaultListeners = () => {
    let returnValue = {};
    server.eventNames().forEach(eventName => {
      returnValue[eventName] = server.listeners(eventName);
    });
    return returnValue;
  };

  const loadPlugins = () => {
    defaultState = getDefaultListeners();
    let currentCommands = getCommandsWithCount();
    commandParents = {};
    fs.readdir('./mine-face-plugins', function (err, files) {
      if (err) {
        console.log(err);
        return;
      }
      //require each one of the files
      files.forEach(file => {
        if (file.endsWith('.js')) {
          var pluginName = file.replace('.js', '');
          console.log(`[Plugin Handler] Loading ${pluginName}`);
          //give the plugin the emitter and store the plugin
          plugins[pluginName] = require(`./mine-face-plugins/${file}`)(server);

          //find out what commands the newly loaded plugin added
          let newCommands = getCommandsWithCount();
          Object.keys(newCommands)
            .filter( name => {
              return newCommands[name] !== currentCommands[name];
            })
            .forEach( name => {
              if(!commandParents[name]){
                commandParents[name] = [];
              }
              commandParents[name].push(pluginName);
            });
          currentCommands = newCommands;
        }
      });
    });
  };

  const reloadPlugins = () => {
    //clear all of the listeners
    server.eventNames().forEach(eventName => {
      server.removeAllListeners(eventName);
    });
    //clean up the plugins
    Object.keys(plugins).forEach(pluginName => {
      plugins[pluginName] && plugins[pluginName].onRemove && plugins[pluginName].onRemove();
      delete require.cache[require.resolve(`./mine-face-plugins/${pluginName}.js`)]; //gotta get rid of the require cache so we can get new changes.
      delete plugins[pluginName];
    });
    //reload the initial listeners
    Object.keys(defaultState).forEach(eventName => {
      defaultState[eventName].forEach(eventFunction => {
        server.on(eventName, eventFunction);
      });
    });
    //load plugins again
    loadPlugins();
  };

  const getCommandsWithCount = () => {
    let returnValue = {};
    getCommandNames().forEach(name => {
      returnValue[name] = server.listenerCount(`command:${name}`);
    });
    return returnValue;
  };

  const getCommandNames = () => {
    return server.eventNames()
      .filter(name => {return name.startsWith('command:')})
      .map(name => {return name.substr('command:'.length)});
  };

  const getPluginNamesForCommand = (commandName) => {
    return commandParents[commandName] || [];
  };

  return {
    plugins,
    loadPlugins,
    reloadPlugins,
    getCommandNames,
    getPluginNamesForCommand
  }
};