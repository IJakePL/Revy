const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "info",
  run: async (client, msg, args) => {
    let uptime = client.uptime / 1000;
    let dni = Math.floor(uptime / 86400);
    uptime %= 86400;
    let godziny = Math.floor(uptime / 3600);
    uptime %= 3600;
    let minuty = Math.floor(uptime / 60);
    let sekundy = Math.floor(uptime % 60);
    let czas = `${dni}d, ${godziny}h, ${minuty}m, ${sekundy}s`;

    const bot = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(`Invite Bot`)
        .setStyle(`LINK`)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands`
        )
    );

    const embed = new MessageEmbed()
      .setColor("#FE7D35")
      .addField(
        `<:mention:928580897073152021> Ping:`,
        `**${client.ws.ping}** ms`,
        true
      )
      .addField(`<:status:928580897148633099> Action time`, `${czas}`, true)
      .addField(
        `<:acc:928580897559683142> Servers:`,
        `**${client.guilds.cache.size}**`,
        true
      )
      .addField(
        `<:user:928580896968306698> Users:`,
        `**${client.users.cache.size}**`,
        true
      )
      .addField(
        `<:cloud:928580896947306526> Usage RAM:`,
        `**${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}** mb`,
        true
      )
      .addField(`<:setting:928580896834080788> Version:`, `**Beta 0.3**`, true);
    msg.reply({
      embeds: [embed],
      components: [bot],
      allowedMentions: { repliedUser: false },
    });
  },
};
