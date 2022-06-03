const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  run: async (client, msg, args) => {
    if (!msg.guild.me.permissions.has("KICK_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> <:reject:928580897559707658> The bot has no kick permission **(**\`🔒 KICK_MEMBERS\`**)**`
            ),
        ],
      });
    } else if (!msg.member.permissions.has("KICK_MEMBERS")) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> <:reject:928580897559707658> You do not have a kick permission **(**\`🔒 KICK_MEMBERS\`**)**`
            ),
        ],
      });
    }

    if (!args[0])
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> <:reject:928580897559707658> Correct command schema\n\n\`\`\`diff\n+ kick <@user> [reason]\n+ kick <ID> [reason]\n\`\`\``
            ),
        ],
      });

    const member =
      msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

    if (!member) {
      msg.react("<:reject:928580897559707658>");
      return;
    }

    if (!member.kickable) {
      msg.react("<:reject:928580897559707658>");
      return;
    }

    if (member.id === msg.author.id || member.id === client.user.id) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> You cannot perform this action on yourself`
            ),
        ],
      });
    }

    if (msg.member.roles.highest.position <= member.roles.highest.position) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> You cannot ban a user with similar permissions`
            ),
        ],
      });
    } else {
      const reason = args.slice(1).join(" ") || "Brak";
      member.kick({ reason: reason });
      msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setDescription(
              `>>> <:leave:928580896951533578> You successfully kicked **${member.user.tag}**\n\n\`\`\`diff\n- ${reason}\n\`\`\``
            )
            .setColor("GREEN")
            .setFooter(
              `${msg.author.tag}`,
              `${msg.author.displayAvatarURL({ dynamic: true })}`
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
