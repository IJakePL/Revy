const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
  name: "dog",
  run: async (client, msg, args) => {
    const { body } = await snekfetch.get("https://random.dog/woof.json");
    const embed = new MessageEmbed()
      .setColor("#2f3136")
      .setAuthor({
        name: `See what sweet dog you have drawn!`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setImage(body.url);

    msg.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  },
};
