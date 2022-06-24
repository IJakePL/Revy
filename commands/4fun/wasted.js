const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "wasted",
  run: async (client, msg, args) => {
    const user = msg.mentions.members.first();
    if (!user) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        content: "Who did he kill?",
      });
    }
    const avatar = user.user.displayAvatarURL({ size: 2048, format: "png" });

    let wasted = new MessageEmbed()
      .setColor("#ff6666")
      .setDescription(`Wasted ${user}`)
      .setImage(`https://some-random-api.ml/canvas/wasted?avatar=${avatar}`);

    return msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [wasted],
    });
  },
};
