const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  run: async (client, msg, args) => {
    if (!msg.guild.me.permissions.has("BAN_MEMBERS")) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> The bot has no ban permission **(**\`🔒 BAN_MEMBERS\`**)**`
            ),
        ],
      });
    } else if (!msg.member.permissions.has("BAN_MEMBERS")) {
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> You do not have a ban permission **(**\`🔒 BAN_MEMBERS\`**)**`
            ),
        ],
      });
    }

    if (!args[0])
      return msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> <:reject:928580897559707658> Correct command schema\n\n\`\`\`diff\n+ ban <@user> [reason]\n+ ban <ID> [reason]\n\`\`\``
            ),
        ],
      });

    const member =
      msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

    if (!member) {
      msg.react("<:reject:928580897559707658>");
      return;
    }

    if (member) {
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

      if (!member.bannable) {
        msg.react("<:reject:928580897559707658>");
        return;
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
        const reason = args.slice(1).join(" ") || "N/N";
        member.ban({ reason: reason });
        msg.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setDescription(
                `>>> <:ban:928580931026059274> You have successfully banned **${member.user.tag}**\n\n\`\`\`diff\n- ${reason}\n\`\`\``
              )
              .setColor("GREEN")
              .setFooter(
                `${msg.author.tag} | (${msg.author.id})`,
                `${msg.author.displayAvatarURL({ dynamic: true })}`
              ),
          ],
          ephemeral: true,
        });
      }
    } else {
      if (args[0] === msg.author.id || args[0] === client.user.id) {
        return msg.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> <:reject:928580897559707658>  You cannot perform this action on yourself or a bot`
              ),
          ],
        });
      }
      const reason1 = args.slice(1).join(" ") || "Brak";
      msg.guild.members
        .ban(args[0], { reason: reason1 })
        .then((user) =>
          msg.reply({
            allowedMentions: { repliedUser: false },
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `>>> <:ban:928580931026059274> You have successfully banned **${user.tag}**\n\n\`\`\`diff\n- ${reason1}\n\`\`\``
                )
                .setColor("GREEN")
                .setFooter(
                  `${msg.author.tag} | (${msg.author.id})`,
                  `${msg.author.displayAvatarURL({ dynamic: true })}`
                ),
            ],
            ephemeral: true,
          })
        )
        .catch(msg.react("❌"));
      return;
    }
  },
};
