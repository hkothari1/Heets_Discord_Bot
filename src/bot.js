require('dotenv').config();
const TicTacToe = require('discord-tictactoe');
const Discord = require('discord.js');

const{Client, MessageAttachment }= require('discord.js');

const client = new Discord.Client();
// const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });


const PREFIX="!";
const{ MessageEmbed }=require("discord.js");
async function promptMessage(message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author,
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
}
const chooseArr = ["🗻","📰", "✂"];


client.once('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
});

new TicTacToe({ language: 'en', command: '!ttt' })
  .attach(client);

client.on('message', async (message) => {
  if (message.content === '_rps') {
      const embed= new MessageEmbed()
        .setColor("WHITE")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
        .setDescription("Add a reaction to one of these emojis to play the game!")
        .setTimestamp();
      const m = await message.channel.send(embed);
      const reacted = await promptMessage(m, message.author, 30, chooseArr);

      const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

      const result = await getResult(reacted, botChoice);
      await m.reactions.removeAll();

      embed
        .setDescription("")
        .addField(result, `${reacted} vs ${botChoice}`);
      m.edit(embed);

      function getResult(me, clientChosen) {
        if ((me === "🗻" && clientChosen === "✂") ||
            (me === "📰" && clientChosen === "🗻") ||
            (me === "✂" && clientChosen === "📰")) {
              return "You won!";
            }
        else if (me === clientChosen) {
              return "It's a tie!";

            }
        else {
          return "You lost!";
        }
      }

    }
  if (message.author.bot) return;
  //console.log(`[${message.author.tag}]: ${message.content}`);
  if (message.content === 'hello'){
    message.reply('hello there!');
  }
  if (message.content === 'bye'){
    message.reply('Goodbye!');
  }
  if (message.content === 'what is my avatar?'){
    message.reply(message.author.displayAvatarURL());
  }
  if (message.content.startsWith(PREFIX)){
    const [CMD_NAME, ...args]= message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
    //console.log(CMD_NAME);
    //console.log(args);
   if (CMD_NAME === 'rip') {
     const attachment = new MessageAttachment('https://health.wyo.gov/wp-content/uploads/2017/05/rip-on-gravestone.jpg');
     message.channel.send(attachment);

   }
   if (CMD_NAME === 'kick') {
      if(!message.member.hasPermission('KICK_MEMBERS'))
      return message.reply('You do not have permissions to use this command.');
      if (args.length === 0) return message.reply('Please provide an ID');
      const member = message.guild.members.cache.get(args[0]);
      if (member){
        member
        .kick()
        .then((member)=>message.channel.send(`${member} was kicked.`))
        .catch((err)=>message.channel.send('I cannot kick that user sorry.'));
      } else{
        message.channel.send('That member was not found');
      }
    //  message.channel.send('Kicked the user');

    }
    else if (CMD_NAME === 'ban') {
      if(!message.member.hasPermission('BAN_MEMBERS'))
      return message.reply('You do not have permissions to use this command.');
      if (args.length === 0) return message.reply('Please provide an ID');

      try{
        const user = await message.guild.members.ban(args[0])
        message.channel.send('User was banned successfully!')
      } catch(err){
        console.log(err);
        message.channel.send('An error occurred. Either I do not have permissions or the user was not found.');
      }
    //  message.channel.send('Banned the user');
    }
    else if (CMD_NAME === 'setNickname') {

      try{
        const user = await message.member.setNickname(args[0])
        message.channel.send('Nickname changed successfully!')
      } catch(err){
        console.log(err);
        message.channel.send('An error occurred. I do not have permissions.');
      }
    }

  }

});

client.login(process.env.DISCORDJS_BOT_TOKEN);
