const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
  name: "cat",
  run: async (client, msg, args) => {
    request("http://edgecats.net/random", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let emb = new MessageEmbed()
          .setImage(body)
          .setColor("#2f3136")
          .setAuthor({
            name: `See what sweet cat you have drawn!`,
            iconURL: client.user.displayAvatarURL(),
          });

        msg.reply({
          embeds: [emb],
          allowedMentions: { repliedUser: false },
        });
      }
    });
  },
};
