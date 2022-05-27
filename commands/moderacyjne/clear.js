const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  run: async (client, msg, args) => {
    if (!msg.guild.me.permissions.has("MANAGE_CHANNELS")) {
      return msg.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> The bot has no channel management permissions **(**\`🔒 MANAGE_CHANNELS\`**)**`
            ),
        ],
      });
    } else if (!msg.member.permissions.has("MANAGE_CHANNELS")) {
      return msg.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> You do not have the channel management permissions **(**\`🔒 MANAGE_CHANNELS\`**)**`
            ),
        ],
      });
    }

    if (!args[0]) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> Enter the number of messages to be deleted`
            )
            .setFooter(
              `${msg.author.tag}`,
              `${msg.author.displayAvatarURL({ dynamic: true })}`
            ),
        ],
        ephemeral: true,
      });
    }
    if (args[0] < 0 || args[0] > 99) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> The number of messages to be deleted must be within the range 0-99`
            )
            .setFooter(
              `${msg.author.tag}`,
              `${msg.author.displayAvatarURL({ dynamic: true })}`
            ),
        ],
        ephemeral: true,
      });
    }

    msg.delete();
    const { size } = await msg.channel
      .bulkDelete(parseInt(args[0]) + 1)
      .catch((err) => {
        return msg.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> <:reject:928580897559707658> You cannot delete messages from 14 days ago`
              ),
          ],
        });
      });
    msg.channel
      .send({
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `>>> <:accept:928580897450639361> ${size} messages have been deleted`
            )
            .setFooter(
              `${msg.author.tag}`,
              `${msg.author.displayAvatarURL({ dynamic: true })}`
            ),
        ],
      })
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  },
};
