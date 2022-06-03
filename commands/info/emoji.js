const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "emoji",
  run: async (client, msg, args) => {
    if (!args[0]) {
      const error = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Enter a name or an emoji ID`);
      return msg.reply({
        embeds: [error],
        allowedMentions: { repliedUser: false },
      });
    }
    let emoji = msg.guild.emojis.cache.find(
      (emoji) => emoji.name === args[0] || emoji.id === args[0]
    );
    if (!emoji) {
      const error = new MessageEmbed()
        .setColor(`ff0000`)
        .setDescription(`Emoji not found`);
      return msg.reply({
        embeds: [error],
        allowedMentions: { repliedUser: false },
      });
    }
    let a = null;
    let x = "`";
    let galaxy;
    let link;
    let name = emoji.name;
    let id = emoji.id;
    let link1 = `https://cdn.discordapp.com/emojis/${id}`;
    if (emoji.animated === true) {
      galaxy = `<a:${name}:${emoji.id}>`;
      link = link1 + ".gif";
    } else {
      galaxy = `<:${name}:${emoji.id}>`;
      link = link1 + ".png";
    }
    let mention = galaxy;
    return msg.reply({
      embeds: [
        new MessageEmbed()
          .setColor(`#468499`)
          .setThumbnail(link)
          .addField("Aspect:", "<:emoji_27:978709532605820939> " + galaxy)
          .addField(
            "Name:",
            "<:emoji_26:978709532584869941> " +
              name +
              "\n<:emoji_27:978709532605820939> " +
              x +
              mention +
              x
          )
          .addField("ID:", "<:emoji_27:978709532605820939> " + id)
          .setFooter({
            text: `${msg.author.tag}`,
            iconURL: `${msg.author.displayAvatarURL({ dynamic: true })}`,
          }),
      ],
      allowedMentions: { repliedUser: false },
    });
  },
};
