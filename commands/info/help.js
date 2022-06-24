const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  GuildMember,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const guilds = require("../../data/guilds");

module.exports = {
  name: "help",
  run: async (client, msg, args) => {
    const savedGuild = await guilds.get(msg.guild.id);
    const prefix = savedGuild.general.prefix;
    const roww = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Please select the appropriate category")
        .addOptions([
          {
            label: "Moderation",
            description: "Click",
            emoji: "928580896834080788",
            value: "mod",
          },
          {
            label: "4Fun",
            description: "Click",
            emoji: "928580897232547850",
            value: "fun",
          },
          {
            label: "Information",
            description: "Click",
            emoji: "928580930887626782",
            value: "info",
          },
          {
            label: "Games",
            description: "Click",
            emoji: "928580897471623178",
            value: "game",
          },
        ])
    );

    const filter = (i) =>
      i.customId === "select" && i.user.id === msg.author.id;

    const collector = msg.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Website")
        .setURL("https://revybot.fun/")
        .setStyle("LINK"),
      new MessageButton()
        .setLabel("Invite Bot")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands"
        )
        .setStyle("LINK")
    );
    const embed = new MessageEmbed()
      .setTitle("Basic help")
      .setDescription(
        "<:star:928580930879225866> Revy is a bot that will help you in the professional management of your server" +
          `\n\n<:emoji_26:978709532584869941> <:globus:928580897182199908>・My prefix is: \` ${prefix} \`\n<:emoji_26:978709532584869941> <:edit:928580897584853022>・Slash command: \` / \`\n<:emoji_26:978709532584869941> <:acc:928580897559683142>・Servers: ${client.guilds.cache.size}\n<:emoji_27:978709532605820939> <:user:928580896968306698>・Users: ${client.users.cache.size}`
      )
      .setColor("#2f3136")
      .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" });
    await msg.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
      components: [row, roww],
    });
    collector.on("collect", async (i) => {
      if (i.customId === "select") {
        if (i.values[0] === "mod") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Moderation commands")
                .setDescription(
                  "<:crown:928580931109941252> **` Moderation (3) `**\n" +
                    `<:emoji_26:978709532584869941> **${prefix}ban [user] [reason]** - Banned user\n` +
                    `<:emoji_26:978709532584869941> **${prefix}kick [user]** - Kick user\n` +
                    `<:emoji_27:978709532605820939> **${prefix}clear [number]** - Delete the specified number of messages\n\n` +
                    "<:question:928580930887626782> **` Information (2) `**\n" +
                    `<:emoji_26:978709532584869941> **${prefix}baninfo** - Check information about a banned person\n` +
                    `<:emoji_27:978709532605820939> **${prefix}bans** - Check the list of banned people`
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "fun") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("4Fun commands")
                .setDescription(
                  "<:photo:928580897232547850> **` Users (10) `**\n" +
                    `<:emoji_26:978709532584869941> **${prefix}8ball** - Ask the magic ball question\n` +
                    `<:emoji_26:978709532584869941> **${prefix}ascii** - Write the text in ascii format\n` +
                    `<:emoji_26:978709532584869941> **${prefix}cat** - Draw a random cat\n` +
                    `<:emoji_26:978709532584869941> **${prefix}dog** - Draw a random dog\n` +
                    `<:emoji_26:978709532584869941> **${prefix}iq** - Check your level of intelligence\n` +
                    `<:emoji_26:978709532584869941> **${prefix}pepe** - Draw a random pepe\n` +
                    `<:emoji_26:978709532584869941> **${prefix}ro** - Play head coin with the robot\n` +
                    `<:emoji_26:978709532584869941> **${prefix}ship [user]** - Test the power of love\n` +
                    `<:emoji_26:978709532584869941> **${prefix}slap [user]** - Hit someone\n` +
                    `<:emoji_27:978709532605820939> **${prefix}wasted [user]** - Kill someone`
                  //`<:emoji_26:978709532584869941> **${prefix}` + ``
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "info") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Information commands")
                .setDescription(
                  "<:user:928580896968306698> **` Users (8) `**\n" +
                    `<:emoji_26:978709532584869941> **${prefix}avatar** - Check server member's avatar\n` +
                    `<:emoji_26:978709532584869941> **${prefix}botinfo** - Bot information\n` +
                    `<:emoji_26:978709532584869941> **${prefix}emoji** - Check the emotes information\n` +
                    `<:emoji_26:978709532584869941> **${prefix}emojis** - Check the emotes on the server\n` +
                    `<:emoji_26:978709532584869941> **${prefix}help** - Information about commands\n` +
                    `<:emoji_26:978709532584869941> **${prefix}invite** - Useful links\n` +
                    `<:emoji_26:978709532584869941> **${prefix}server** - Information about the server\n` +
                    `<:emoji_27:978709532605820939> **${prefix}user [user]** - User information`
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "game") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Games commands")
                .setDescription(
                  "<:user:928580896968306698> **` Users (5) `**\n" +
                    `<:emoji_26:978709532584869941> **${prefix}2048** - Game 2048\n` +
                    `<:emoji_26:978709532584869941> **${prefix}rps** - Game rps\n` +
                    `<:emoji_26:978709532584869941> **${prefix}slots** - Game slots\n` +
                    `<:emoji_26:978709532584869941> **${prefix}snake** - Game snake\n` +
                    `<:emoji_27:978709532605820939> **${prefix}tictactoe** - Game tictactoe`
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
      }
    });
  },
};
