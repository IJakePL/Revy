const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "emojis",
  run: async (client, msg, args) => {
    let Emojis = "";
    let EmojisAnimated = "";
    let EmojiCount = 0;
    let Animated = 0;
    let OverallEmojis = 0;
    function Emoji(id) {
      return client.emojis.cache.get(id).toString();
    }
    msg.guild.emojis.cache.forEach((emoji) => {
      OverallEmojis++;
      if (emoji.animated) {
        Animated++;
        EmojisAnimated += Emoji(emoji.id);
      } else {
        EmojiCount++;
        Emojis += Emoji(emoji.id);
      }
    });
    let Embed = new MessageEmbed()
      .setColor(`#468499`)
      .setTitle(`Server emoji list ${msg.guild.name}`)
      .setDescription(
        `\n\n**Animated** [ **\`${Animated}\`** ]:\n\n${EmojisAnimated}\n\n**Common** [ **\`${EmojiCount}\`** ]:\n\n${Emojis}`
      )
      .setFooter({
        text: `${msg.author.tag}`,
        iconURL: `${msg.author.displayAvatarURL({ dynamic: true })}`,
      });
    await msg.reply({
      allowedMentions: { repliedUser: false },
      ephemeral: true,
      embeds: [Embed],
    });
  },
};
