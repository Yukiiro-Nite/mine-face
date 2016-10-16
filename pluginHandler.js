module.exports = (server) => {
  const fs = require('fs');

  let plugins = {};

  let defaultState;

  const getDefaultListeners = () => {
    let returnValue = {};
    server.eventNames().forEach(eventName => {
      returnValue[eventName] = server.listeners(eventName);
    });
    return returnValue;
  };

  const loadPlugins = () => {
    defaultState = getDefaultListeners();
    fs.readdir('./plugins', function (err, files) {
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
          plugins[pluginName] = require(`./plugins/${file}`)(server);
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
      delete require.cache[require.resolve(`./plugins/${pluginName}.js`)]; //gotta get rid of the require cache so we can get new changes.
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

  return {
    loadPlugins: loadPlugins,
    reloadPlugins: reloadPlugins,
    plugins: plugins
  }
};