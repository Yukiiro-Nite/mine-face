module.exports = (server) => {
  let requests = {};
  server.on('command:tpa', (player, args) => {
    if(!args[0]){
      server.commands.tellraw(player, {text:'Please specify a player! (eg. -tpa Player1)', color:'red'});
    } else if(!server.players[args[0]]) {
      server.commands.tellraw(player, {text:`${args[0]} is not online.`, color:'red'});
    } else {
      requests[args[0]] = [player, args[0]];
      server.commands.tellraw(player, {text:`Sent a tpa request to ${args[0]}!`, color:'green'});
      server.commands.tellraw(args[0], [
        {text:`${player} has requested to tp to you! `, color:'yellow'},
        {
          text:'Accept',
          color:'green',
          clickEvent:{action:"run_command", value:`-tpaccept`},
          hoverEvent:{action:"show_text", value:{text:`click to tp ${player} to you`}},
          underlined:true
        },
        " ",
        {
          text:'Decline',
          color:'red',
          clickEvent:{action:"run_command", value:`-tpdecline`},
          hoverEvent:{action:"show_text", value:{text:`click to decline ${player}'s request`}},
          underlined:true
        }
      ]);
    }
  });

  server.on('command:tpahere', (player, args) => {
    if(!args[0]){
      server.commands.tellraw(player, {text:'Please specify a player! (eg. -tpa Player1)', color:'red'});
    } else if(!server.players[args[0]]) {
      server.commands.tellraw(player, {text:`${args[0]} is not online.`, color:'red'});
    } else {
      requests[args[0]] = [args[0], player];
      server.commands.tellraw(player, {text:`Sent a tpahere request to ${args[0]}!`, color:'green'});
      server.commands.tellraw(args[0], [
        {text:`${player} has requested you to tp to them! `, color:'yellow'},
        {
          text:'Accept',
          color:'green',
          clickEvent:{action:"run_command", value:`-tpaccept`},
          hoverEvent:{action:"show_text", value:{text:`click to tp to ${player}`}},
          underlined:true
        },
        " ",
        {
          text:'Decline',
          color:'red',
          clickEvent:{action:"run_command", value:`-tpdecline`},
          hoverEvent:{action:"show_text", value:{text:`click to decline ${player}'s request`}},
          underlined:true
        }
      ]);
    }
  });

  server.on('command:tpaccept', (player) => {
    if(!requests[player]){
      server.commands.tellraw(player, {text:'You have no pending requests!', color:'red'});
    } else {
      server.commands.tellraw(requests[player][0], {text:`Teleporting you to ${requests[player][1]}!`, color:'green'});
      server.commands.tellraw(requests[player][1], {text:`Teleporting ${requests[player][0]} to you!`, color:'green'});
      server.commands.ptp(...requests[player]);
      delete requests[player];
    }
  });

  server.on('command:tpdecline', (player) => {
    if(!requests[player]){
      server.commands.tellraw(player, {text:'You have no pending requests!', color:'red'});
    } else {
      server.commands.tellraw(player, {text:'Pending teleport request rejected!', color:'green'});
      delete requests[player];
    }
  });
};
