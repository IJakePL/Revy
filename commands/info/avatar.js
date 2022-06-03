const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  run: async (client, msg, args) => {
    const member =
      msg.mentions.members.first() ||
      msg.guild.members.cache.get(args[0]) ||
      msg.guild.members.cache.find((m) => m.user.username == args[0]) ||
      msg.member;

    msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        new MessageEmbed()
          .setColor(`#468499`)
          .setDescription(
            `[PNG](${member.user.displayAvatarURL({
              format: "png",
              size: 1024,
            })}) ︴ [JPG](${member.user.displayAvatarURL({
              format: "jpg",
              size: 1024,
            })}) ︴ [GIF](${member.user.displayAvatarURL({
              format: "gif",
              size: 1024,
              dynamic: true,
            })}) ︴ [WEBP](${member.user.displayAvatarURL({
              format: "webp",
              size: 1024,
            })})`
          )
          .setImage(
            member.user.displayAvatarURL({ dynamic: true, size: 1024 })
          ),
      ],
      allowedMentions: { repliedUser: false },
    });
    return;
  },
};
