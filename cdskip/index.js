import PogObject from "PogData";

let isWaitingForJoin = false;

let data = new PogObject("cdskip", {
  "username": "",
  "first_time": true
}, ".cdskipper.json");	

if(data.first_time) {
  data.first_time = false;
  data.save();
  ChatLib.chat("&d[CdSkip] &5Do /cd for help.");
}

register("command", (...args) => {
  if(args[0] == undefined) {
    ChatLib.chat("&d[CdSkip] &5Help:");
    ChatLib.chat("&9/cd skip&8- &5Executes cooldown skip.");
    ChatLib.chat("&9/cd set <player> &8- &5Specify the other player doing a cooldown skip.");
    ChatLib.chat("&9/cd current &8- &5Show the current player set to cooldown skip.");
    ChatLib.chat("&9/cd reset &8- &5Removes current player.");
    return;
  } else if(args[0] == "skip") {
    if(data.username === "") {
      ChatLib.chat("&d[CdSkip] &5No player specified. Please do &9/cd set <player>.");
      return;
    }
    ChatLib.command("help");
    return;
  } else if(args[0] == "set") {
    if(args[1] == undefined) {
      ChatLib.chat("&d[CdSkip] &5No player specified. Please do &9/cd set <player>.");
      return;
    }
    data.username = args[1];
    data.save();
    ChatLib.chat(`&d[CdSkip] &5Player set to &e${data.username}`);
    return;
  } else if(args[0] == "current") {
    if(data.username === "") {
      ChatLib.chat("&d[CdSkip] &5No player specified. Please do &9/cd set <player>.");
      return;
    }
    ChatLib.chat(`&d[CdSkip] &5Current Player: &e${data.username}`);
    return;
  } else if(args[0] == "reset") {
    data.username = "";
    data.first_time = true;
    data.save();
    ChatLib.chat("&d[CdSkip] &5Data reset.");
    return;
  } else {
    return;
  }
}).setName("cd").setAliases(["cdskip"]);

register("chat", () => {
  if(data.username === "") {
    return ChatLib.chat("&d[CdSkip] &5No player specified. Please do &9/cd set <player>.");
  }
  isWaitingForJoin = true;
  ChatLib.command(`p ${data.username}`);
}).setCriteria(/^\[NPC\] Elle: Talk with me to begin!$/);

register("chat", (player) => {
  if(isWaitingForJoin && player.toLowerCase().includes(data.username.toLowerCase())) {
    isWaitingForJoin = false;
    ChatLib.command("p warp");
    setTimeout(() => ChatLib.command(`p transfer ${data.username}`), 500);
    setTimeout(() => ChatLib.command(`p leave`), 1000);
  }
  return;
}).setCriteria(/^([\[\]+ \w\d]+) joined the party.$/);