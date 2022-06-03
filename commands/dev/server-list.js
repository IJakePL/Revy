const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "server-list",
  run: async (client, msg, args) => {
    if (msg.author.id !== "427505231937404942") {
      return;
    }

    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let embed = new MessageEmbed()
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })

      .setColor("00FFFF")
      .setFooter({
        text: `Strona - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`,
      })
      .setDescription(
        `<:crown:928580931109941252> Wszystkie Serwery: **\`${client.guilds.cache.size}\`**\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r) => r)
            .map(
              (r, i) =>
                `<:discrim:928580931156054016> Numer: **${
                  i + 1
                }**\n<:globus:928580897182199908> ${
                  r.name
                } \n<:user:928580896968306698> ${
                  r.memberCount
                } Osób\n<:id:928580897291268126> ${r.id}`
            )
            .slice(0, 10)
            .join("\n\n")
      );

    let smb = await msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [embed],
    });

    await smb.react("⬅");
    await smb.react("➡");
    await smb.react("❌");

    let collector = msg.createReactionCollector(
      (reaction, user) => user.id === message.author.id
    );

    collector.on("collect", async (reaction, user) => {
      if (reaction._emoji.name === "⬅") {
        // Updates variables
        i0 = i0 - 10;
        i1 = i1 - 10;
        page = page - 1;

        // if there is no guild to display, delete the message
        if (i0 + 1 < 0) {
          console.log(i0);
          return msg.delete();
        }
        if (!i0 || !i1) {
          return msg.delete();
        }

        description =
          `Wszystkie serwery - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r) => r)
            .map(
              (r, i) =>
                `**${i + 1}** - ${r.name} | ${r.memberCount} Osób\nID - ${r.id}`
            )
            .slice(i0, i1)
            .join("\n\n");

        // Update the embed with new informations
        embed
          .setFooter(
            `Strona - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
          )
          .setDescription(description);

        // Edit the message
        msg.edit(embed);
      }

      if (reaction._emoji.name === "➡") {
        // Updates variables
        i0 = i0 + 10;
        i1 = i1 + 10;
        page = page + 1;

        // if there is no guild to display, delete the message
        if (i1 > client.guilds.cache.size + 10) {
          return msg.delete();
        }
        if (!i0 || !i1) {
          return msg.delete();
        }

        description =
          `Wszystkie serwery - ${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r) => r)
            .map(
              (r, i) =>
                `**${i + 1}** - ${r.name} | ${r.memberCount} Osób\nID - ${r.id}`
            )
            .slice(i0, i1)
            .join("\n\n");

        // Update the embed with new informations
        embed
          .setFooter(
            `Strona - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
          )
          .setDescription(description);

        // Edit the message
        msg.edit(embed);
      }

      if (reaction._emoji.name === "❌") {
        return msg.delete();
      }

      // Remove the reaction when the user react to the message
      await reaction.users.remove(message.author.id);
    });
  },
};
