const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "iq",
  run: async (client, msg, args) => {
    msg.reply({
      content: "Your iq totals: " + Math.floor(Math.random() * 300),
      allowedMentions: { repliedUser: false },
    });
  },
};
