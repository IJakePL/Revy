const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "8ball",
  run: async (client, msg, args) => {
    if (!args[1])
      return message.reply(
        "Plesae enter a full question with 2 or more words!"
      );
    let replies = [
      "Yes",
      "No",
      "WTF?",
      "I don't know",
      "Ask again later!",
      "Cyka",
      "I am not sure!",
      "Pls No",
      "You tell me",
    ];

    let result = Math.floor(Math.random() * replies.length);
    let question = args.join(" ");

    let ballembed = new MessageEmbed()

      .setColor("#2f3136")
      .setAuthor({
        name: `He asked the question ${msg.author.tag}!`,
        iconURL: client.user.displayAvatarURL(),
      })
      .addField(
        "<:question:928580930887626782> Question:",
        "・" + question,
        true
      )
      .addField(
        "<:search:928580896502726677> Answer:",
        "・" + replies[result],
        true
      );

    msg.reply({ embeds: [ballembed], allowedMentions: { repliedUser: false } });
  },
};
