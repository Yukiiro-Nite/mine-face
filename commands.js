module.exports=function(io){
	
	var sendCommand=function(command,args){
		io.write(`${command} ${args.join(' ')}\r\n`);
	};

	var sendRawCommand=(string)=>{
		io.write(`${string}\r\n`);
	};

	var ban=(player,reason)=>{
		sendCommand('ban',[player,reason]);
	};

	var clear=(player,item,n)=>{
		sendCommand('clear',[player,item,maxCount]);
	};

	var difficulty=(level)=>{
		sendCommand('difficulty',[level]);
	};

	var effect=(player,effect,seconds,amplifier)=>{
		sendCommand('effect',[player,effect,seconds,amplifier]);
	};

	var gamemode=(player,mode)=>{
		sendCommand('gamemode',[player,mode]);
	};
	
	var give=(player,item,amount)=>{
		sendCommand('give',[player,item,amount]);
	};

	var kick=(player,reason)=>{
		sendCommand('kick',[player,reason]);
	};

	var pardon=(player)=>{
		sendCommand('pardon',[player]);
	};

	var ptp=(player,destinationPlayer)=>{
		sendCommand('ptp',[player,destinationPlayer]);
	}

	var say=(message)=>{
		sendRawCommand(`say ${message}`);
	};

	var tellRaw=(player,message)=>{
		sendRawCommand(`tellRaw ${player} ${JSON.stringify(message)}`);
	}

	var tp=(player,x,y,z)=>{
		sendCommand('tp',[player,x,y,z]);
	};

	var tpRelative = (player, x, y, z) => {
		sendCommand('tp', [`~${x}`,`~${y}`,`~${z}`]);
	};

	var weather=(type)=>{
		sendCommand('weather',[type]);
	};

	return {
		sendCommand: sendCommand,
		sendRawCommand: sendRawCommand,
		ban: ban,
		clear: clear,
		difficulty: difficulty,
		effect: effect,
		gamemode: gamemode,
		give: give,
		kick: kick,
		pardon: pardon,
		say: say,
		tp: tp,
		weather: weather
	}

};