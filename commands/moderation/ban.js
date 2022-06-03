const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

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
                `>>> <:reject:928580897559707658> You cannot perform this action on yourself or me`
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
        const reason = args.slice(1).join(" ") || "No reason was given!";
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId("true")
              .setLabel("Yes")
              .setStyle("SUCCESS")
          )
          .addComponents(
            new MessageButton()
              .setCustomId("false")
              .setLabel("No")
              .setStyle("DANGER")
          );
        const row1 = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId("cancel-true")
              .setLabel("Yes")
              .setStyle("SUCCESS")
          )
          .addComponents(
            new MessageButton()
              .setCustomId("cancel-false")
              .setLabel("No")
              .setStyle("DANGER")
          );
        const coming = new MessageEmbed()
          .setColor("#ff0000")
          .setDescription(
            `Are you sure you want to perform this action on ${member} user with the reason **${reason}**?`
          );
        msg.reply({
          allowedMentions: { repliedUser: false },
          embeds: [coming],
          components: [row],
        });

        const filter = (i) =>
          (i.customId === "true" && i.user.id === msg.author.id) ||
          (i.customId === "false" && i.user.id === msg.author.id) ||
          (i.customId === "cancel-true" && i.user.id === msg.author.id) ||
          (i.customId === "cancel-false" && i.user.id === msg.author.id);

        const collector = msg.channel.createMessageComponentCollector({
          filter,
          time: 15000,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "true") {
            member.ban({ reason: reason });
            const embed = new MessageEmbed()
              .setDescription(
                `>>> <:ban:928580931026059274> You have successfully banned **${member.user.tag}**\n\n\`\`\`diff\n- ${reason}\n\`\`\``
              )
              .setColor("GREEN")
              .setFooter(
                `${msg.author.tag}`,
                `${msg.author.displayAvatarURL({ dynamic: true })}`
              );
            await i.update({
              embeds: [embed],
              components: [],
            });
          }
          if (i.customId === "false") {
            i.update({
              embeds: [
                new MessageEmbed()
                  .setColor("#ff0000")
                  .setDescription("Are you sure you want to end the action?"),
              ],
              components: [row1],
            });
          }
          if (i.customId === "cancel-false") {
            i.update({
              embeds: [coming],
              components: [row],
            });
          }
          if (i.customId === "cancel-true") {
            i.update({
              embeds: [
                new MessageEmbed()
                  .setColor("GREEN")
                  .setDescription("Actions successfully completed!"),
              ],
              components: [],
            });
          }
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
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("true")
            .setLabel("Yes")
            .setStyle("SUCCESS")
            .setEmoji("928580897450639361")
        )
        .addComponents(
          new MessageButton()
            .setCustomId("false")
            .setLabel("No")
            .setStyle("DANGER")
            .setEmoji("928580897559707658")
        );
      const coming = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `> Are you sure you want to perform this action on ${member} user z powodem ${reason1}?`
        );
      msg.reply({
        allowedMentions: { repliedUser: false },
        embeds: [coming],
        components: [row],
      });
      // msg.guild.members
      //   .ban(args[0], { reason: reason1 })
      //   .then((user) =>
      //     msg.reply({
      //       allowedMentions: { repliedUser: false },
      //       embeds: [
      //         new MessageEmbed()
      //           .setDescription(
      //             `>>> <:ban:928580931026059274> You have successfully banned **${user.tag}**\n\n\`\`\`diff\n- ${reason1}\n\`\`\``
      //           )
      //           .setColor("GREEN")
      //           .setFooter(
      //             `${msg.author.tag} | (${msg.author.id})`,
      //             `${msg.author.displayAvatarURL({ dynamic: true })}`
      //           ),
      //       ],
      //       ephemeral: true,
      //     })
      //   )
      //   .catch(msg.react("❌"));
      // return;
    }
  },
};
