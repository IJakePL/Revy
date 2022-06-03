const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "test",
  run: async (client, msg, args) => {
    msg.channel.send("test");
  },
};
