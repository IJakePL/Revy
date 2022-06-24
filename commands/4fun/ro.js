const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "coin",
  run: async (client, msg, args) => {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("eagle")
          .setLabel("Eagle")
          .setStyle("SECONDARY")
          .setEmoji("980510176362790982")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("coin")
          .setLabel("Tails")
          .setStyle("SECONDARY")
          .setEmoji("980510176543121468")
      );
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription("> Choose the options that are right for you!");
    msg.reply({
      allowedMentions: { repliedUser: false },
      embeds: [embed],
      components: [row],
    });

    const filter = (i) =>
      (i.customId === "eagle" && i.user.id === msg.author.id) ||
      (i.customId === "coin" && i.user.id === msg.author.id);

    const collector = msg.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    const monet = ["eagle", "tails"];
    const wypadlobot = monet[Math.floor(Math.random() * monet.length)];

    collector.on("collect", async (i) => {
      if (i.customId === "eagle") {
        if (wypadlobot === "tails") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setColor("#eb4334")
                .setDescription(
                  `> Your choose: <:eagle:980510176362790982> **Eagle**\n> Revy choose: <:coin:980510176543121468> **Tails** \n\n> Fell out: <:coin:980510176543121468> **Tails**\n\n> Winners: <@${client.user.id}>`
                ),
            ],
            components: [],
          });
        }
        if (wypadlobot === "eagle") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setColor("#3aeb34")
                .setDescription(
                  `> Your choose: <:eagle:980510176362790982> **Eagle**\n> Revy choose: <:coin:980510176543121468> **Tails** \n\n> Fell out: <:eagle:980510176362790982> **Eagle**\n\n> Winners: <@${msg.author.id}>!`
                ),
            ],
            components: [],
          });
        }
      }
      if (i.customId === "coin") {
        if (wypadlobot === "tails") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setColor("#11f01c")
                .setDescription(
                  `> Your choose: <:coin:980510176543121468> **Tails**\n> Revy choose: <:eagle:980510176362790982> **Eagle**\n\n> Fell out: <:coin:980510176543121468> **Tails**\n\n> Winners: <@${msg.author.id}>!`
                ),
            ],
            components: [],
          });
        }
        if (wypadlobot === "eagle") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setColor("#f01111")
                .setDescription(
                  `> Your choose: <:coin:980510176543121468> **Tails**\n> Revy choose: <:eagle:980510176362790982> **Eagle** \n\n> Fell out: <:eagle:980510176362790982> **Eagle**\n\n> Winners: <@${client.user.id}>`
                ),
            ],
            components: [],
          });
        }
      }
    });
  },
};
