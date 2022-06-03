const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  run: async (client, msg, args) => {
    const zapro = new MessageEmbed()
      .setColor("#468499")
      .setAuthor({
        name: msg.author.tag + " - Useful links:",
        iconURL: `${msg.author.displayAvatarURL({ dynamic: true })}`,
      })
      .addField(
        `> **Support**`,
        `**[Click Me!](https://discord.gg/ycUAaHMQuY)**`,
        true
      )
      .addField(
        `> **Invite**`,
        `**[Click Me!](https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands)**`,
        true
      )
      .addField(
        `> **Vote for me**`,
        `**[SOON](https://discord.gg/ycUAaHMQuY)**`,
        true
      );
    msg.reply({
      allowedMentions: { repliedUser: false },
      ephemeral: true,
      embeds: [zapro],
    });
  },
};
