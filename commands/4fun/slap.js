const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "slap",
  run: async (client, msg, args) => {
    let mentionedMember = msg.mentions.members.first() || msg.member;

    const slap = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${msg.author} hitting ${mentionedMember}`)
      .setImage("https://c.tenor.com/Vy37Fo5CRU8AAAAC/tokatla-slap.gif");
    return msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [slap],
    });
  },
};
