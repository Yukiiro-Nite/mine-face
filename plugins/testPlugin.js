module.exports = (server) => {
    server.on('command:test', (player, args) => {
        console.log(`test command fired with args: ${args.join(" ")}`);
    });
};