const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ship",
  run: async (client, msg, args) => {
    const block = "⬛";
    const heart = ":red_square:";

    const user = msg.mentions.users.first();
    if (!user) return msg.reply(`Podaj osobę!`);
    if (user && user.id === msg.author.id) {
      return msg.reply("Nie możesz ze samym sobą!");
    }
    if (msg.mentions.users.size < 2) {
      let loveEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`Ship ${msg.author} and ${user}!`)
        .setImage(
          `https://api.popcatdev.repl.co/ship?user1=${msg.author.displayAvatarURL(
            { dynamic: false, format: "png" }
          )}&user2=${user.displayAvatarURL({ dynamic: false, format: "png" })}`
        )
        .addField(`**Ship power**`, ship());

      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [loveEmbed],
      });
    } else if (msg.mentions.users.size > 1) {
      let luv = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `Ship ${msg.mentions.users.first()} and ${msg.mentions.users.last()}!`
        )
        .setImage(
          `https://api.popcatdev.repl.co/ship?user1=${msg.mentions.users
            .first()
            .displayAvatarURL({
              dynamic: false,
              format: "png",
            })}&user2=${msg.mentions.users
            .last()
            .displayAvatarURL({ dynamic: false, format: "png" })}`
        )
        .addField(`**Ship power**`, ship());
      msg.reply({ allowedMentions: { repliedUser: false }, embeds: [luv] });
    }

    function ship() {
      const hearts = Math.floor(Math.random() * 100) + 1;
      const hearte = hearts / 10;

      const str = `${heart.repeat(hearte)}${block.repeat(
        11 - hearte
      )} ${hearts}%`;
      return str;
    }
  },
};
