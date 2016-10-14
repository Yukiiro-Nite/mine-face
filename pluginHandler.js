module.exports = (server) => {
  var fs = require('fs');

  var plugins = {};

  var loadPlugins = () => {
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

  var reloadPlugins = () => {
    //figure out how to properly unload a plugin
  };

  return {
    loadPlugins: loadPlugins,
    reloadPlugins: reloadPlugins,
    plugins: plugins
  }
};