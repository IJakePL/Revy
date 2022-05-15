const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");

module.exports = {
  name: "user",
  run: async (client, msg, args) => {
    moment.locale(`en`);

    const oznaczuser =
      msg.mentions.members.first() ||
      msg.guild.members.cache.get(args[0]) ||
      msg.guild.members.cache.find((m) => m.user.username == args[0]) ||
      msg.member;

    const userinfo = new MessageEmbed()
      .setThumbnail(oznaczuser.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor("#FE7D35")
      .setAuthor({
        name: oznaczuser.user.tag,
        iconURL: oznaczuser.displayAvatarURL({ dynamic: true }),
      })
      .addField(
        "Joined Discord:",
        `${moment(oznaczuser.user.createdAt, "YYYYMMDD").fromNow()}`,
        true
      )
      .addField(
        "Joined Server:",
        `${moment(oznaczuser.joinedAt, "YYYYMMDD").fromNow()}`,
        true
      );
    msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [userinfo],
    });
  },
};
