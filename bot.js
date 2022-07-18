const mineflayer = require("mineflayer");
const config = require("./config.json");
const password = config.mc.password
console.log("Bot Is Connected!")
const bot = mineflayer.createBot({
        username: config.mc.username,
        host: config.mc.host,
        verison: config.mc.verison
})

// Auto Reconnect
const RECONNECT = false

bot.on('end', function () {
    if(AUTO_LOG){
        return
    }
    if(RECONNECT){
        createBot()
    }
})        

///Login for cracked servers
var isLogin = false;

bot.on("message", jsonMsg => {
    if (isLogin) return;
    isLogin = true;
    if (jsonMsg.toString().includes("/register")) bot.chat(`/register ${password} ${password}`);
    else if (jsonMsg.toString().includes("/login")) bot.chat(`/login ${password}`);
});

require('dotenv').config();
const Discord = require('discord.js');

const discordBot = new Discord.Client({
   allowedMentions: {repliedUser: false },
   intents: [Discord.Intents.FLAGS.GUILD_MESSAGES],
});

// Console log bot logins and disconnects
discordBot.on('ready', () => {
   console.log(`The Discord bot ${discordBot.user.username} is ready!`);
});

bot.on('login', () => {
   console.log('Minecraft bot has logged in!');
});

bot.on('end', () => {
   console.log('Minecraft bot disconnected from the server.');
});

const discordServerID = config.dc.server;
const chatChannelID = config.dc.channel;

// Send message to channel in server
async function toDiscordChat(msg) {
   await discordBot.guilds.cache.get(discordServerID).channels.fetch();
   return discordBot.guilds.cache.get(discordServerID).channels.cache.get(chatChannelID).send({
      content: msg,
   });
}

// Discord chat to Minecraft chat
discordBot.on('messageCreate', async (message) => {
   try {
      if (message.author.id === discordBot.user.id || message.channel.id !== chatChannelID || message.author.bot) return;
      bot.chat(`Discord <||> ${message.author.username}: ${message.content}`);
   } catch (err) {
      console.error(err);
   }
});

// Minecraft chat to Discord chat
bot.on('chat', (username, message) => {
   if (username === bot.username) return;
   toDiscordChat(`${username}: ${message}`);
   console.log(`Minecraft <||> ${username}: ${message}`);
});


//coords command
bot.on("chat", (username, message) => {
   if(username === bot.username) return
   if(message === "%coords") {
      bot.chat("My Coords are: " + bot.entity.position.toString())
   }
});

const fs = require('fs');

bot.on('messagestr', message => {
  fs.appendFile('./chat.txt', message + '\n', (err) => {
    if (err) console.error(err)
  })
});

//crash command
bot.on("chat", (username, message) => {
   if(username === bot.username) return
       if (username != '2l2c') return;
   if (message === "%crash") {
      bot.chat("I ragequit")
      bot.quit()
   }
});

//discord command
bot.on("message", jsonMsg => {
   if (jsonMsg.toString().includes("%discord")) 
   bot.chat("gg/6tmcPEUxWu > shortend because of chat filter");
});

//auto tpa acceptor
bot.on("message", jsonMsg => {
   if (jsonMsg.toString().includes("has requested to teleport to you.")) 
   bot.chat("/tpaccept");
});

//kill command
bot.on("chat", (username, jsonMsg) => {
   if (username != config.mc.admin) return
   if (jsonMsg.toString().includes("%kill")) bot.chat("/kill");
});

discordBot.login(config.dc.token);
