module.exports = (io) => {
	const sendCommand = (command, args) => {
		io.write(`${command} ${args.join(' ')}\r\n`);
	};

	const sendRawCommand = (string) => {
		io.write(`${string}\r\n`);
	};
	
	return {
		ban: (player, reason) => {
			sendCommand('ban', [player, reason]);
		},
		clear: (player, item, dataValue, maxCount) => {
			sendCommand('clear', [player, item, dataValue, maxCount]);
		},
		difficulty: (level) => {
			sendCommand('difficulty', [level]);
		},
		effect: (player, effect, seconds, amplifier)=>{
			sendCommand('effect', [player, effect, seconds, amplifier]);
		},
		gamemode: (player, mode) => {
			sendCommand('gamemode', [player, mode]);
		},
		give: (player, item, amount) => {
			sendCommand('give', [player, item, amount]);
		},
		kick: (player, reason) => {
			sendCommand('kick', [player, reason]);
		},
		pardon: (player) => {
			sendCommand('pardon', [player]);
		},
		ptp: (player, destinationPlayer) => {
			sendCommand('ptp', [player, destinationPlayer]);
		},
		say: (message) => {
			sendRawCommand(`say ${message}`);
		},
		tellraw: (player, message) => {
			sendRawCommand(`tellraw ${player} ${JSON.stringify(message)}`);
		},
		tp: (player, x, y, z) => {
			sendCommand('tp', [player, x, y, z]);
		},
		tpRelative: (player, x, y, z) => {
			sendCommand('tp', [`~${x}`,`~${y}`,`~${z}`]);
		},
		weather: (type) => {
			sendCommand('weather', [type]);
		}
	};
};