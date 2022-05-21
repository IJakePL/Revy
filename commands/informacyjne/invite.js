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
        `> **Server Support**`,
        `:link: **[Kliknij Mnie!](https://discord.gg/ycUAaHMQuY)**`,
        true
      )
      .addField(
        `> **Invite Bot**`,
        `:link: **[Kliknij Mnie!](https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands)**`,
        true
      );
    msg.reply({
      allowedMentions: { repliedUser: false },
      ephemeral: true,
      embeds: [zapro],
      allowedMentions: { repliedUser: false },
    });
  },
};
