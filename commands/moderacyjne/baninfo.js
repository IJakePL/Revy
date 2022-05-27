const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "baninfo",
  run: async (client, msg, args) => {
    if (!msg.member.permissions.has("KICK_MEMBERS")) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> You do not have the ban view permissions **(**\`🔒 KICK_MEMBERS\`**)**`
            ),
        ],
      });
    }
    const bot = {
      true: "True",
      false: "False",
    };
    if (!args[0])
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> Correct command schema\n\n\`\`\`diff\n+ baninfo <ID>\n\`\`\``
            ),
        ],
      });
    msg.guild.bans.fetch().then((banned) => {
      let user = banned.get(args[0]);
      if (!user) {
        msg.react("<:reject:928580897559707658>");
        return;
      }
      msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `>>> <:ban:928580931026059274> **Ban information** \n\`\`\`diff\n+ NICK: ${
                user.user.tag
              }\n+ BOT: ${bot[user.user.bot]}\n+ ID: ${
                user.user.id
              }\n\n- REASON: ${user.reason.slice(0, 300)}\n\`\`\``
            )
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true })),
        ],
      });
      return;
    });
  },
};
