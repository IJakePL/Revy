const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");

module.exports = {
  name: "server",
  run: async (client, msg, args) => {
    const verificationLevels = {
      NONE: "0",
      LOW: "1",
      MEDIUM: "2",
      HIGH: "3",
      VERY_HIGH: "4",
    };

    let szyscy = msg.guild.memberCount;
    let boty = msg.guild.members.cache.filter((member) => member.user.bot).size;
    let users = szyscy - boty;

    msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        new MessageEmbed()
          .setColor("#FE7D35")
          .setThumbnail(msg.guild.iconURL({ dynamic: true, size: 512 }))
          .setAuthor({
            name: `${msg.guild.name}`,
            iconURL: msg.guild.iconURL({ dynamic: true, size: 512 }),
          })
          .addField(
            `<:id:928580897291268126> Server ID:`,
            `${msg.guild.id}`,
            true
          )
          .addField(
            `<:globus:928580897182199908> Created On`,
            `**${moment(msg.guild.createdTimestamp).fromNow()}**`,
            true
          )
          .addField(
            `<:crown:928580931109941252> Owned by`,
            `<@${msg.guild.ownerId}>`,
            true
          )
          .addField(
            `<:user:928580896968306698>  **Members** (${szyscy})`,
            `**${users}** Users | **${boty}** Bots\n**${
              msg.guild.premiumSubscriptionCount || "0"
            }** Boosts`,
            true
          )
          .addField(
            `<:discrim:928580931156054016> Channels (` +
              Number(
                msg.guild.channels.cache.filter(
                  (channel) => channel.type === "GUILD_TEXT"
                ).size +
                  msg.guild.channels.cache.filter(
                    (channel) => channel.type === "GUILD_VOICE"
                  ).size
              ) +
              ")",
            `**${
              msg.guild.channels.cache.filter(
                (channel) => channel.type === "GUILD_TEXT"
              ).size
            }** Text | **${
              msg.guild.channels.cache.filter(
                (channel) => channel.type === "GUILD_VOICE"
              ).size
            }** Voice`,
            true
          )
          .addField(
            `**<:lock:928580930984116234> Verification**`,
            `Level: **${verificationLevels[msg.guild.verificationLevel]}**`,
            true
          ),
      ],
      allowedMentions: { repliedUser: false },
    });
  },
};
