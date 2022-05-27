const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bans",
  run: async (client, msg, args) => {
    if (!msg.member.permissions.has("KICK_MEMBERS")) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> You do not have a permissions to the banned list **(**\`🔒 KICK_MEMBERS\`**)**`
            ),
        ],
      });
    }
    msg.guild.bans.fetch().then((banned) => {
      let list = banned
        .map((ban) => "+ " + ban.user.tag + " (" + ban.user.id + ")")
        .join("\n");
      if (!list) list = "- No banned users";
      if (list.length >= 1950) list = `${list.slice(0, 1900)}...`;
      msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setDescription(
              `>>> <:ban:928580931026059274> **Lista Zbanowanych** \n\`\`\`diff\n${list}\n\`\`\``
            )
            .setColor("GREEN")
            .setFooter(
              `${msg.author.tag}`,
              `${msg.author.displayAvatarURL({ dynamic: true })}`
            ),
        ],
      });
      return;
    });
  },
};
