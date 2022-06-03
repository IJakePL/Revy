// const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

// module.exports = {
//   name: "coin",
//   run: async (client, msg, args) => {
//     const row = new MessageActionRow()
//       .addComponents(
//         new MessageButton()
//           .setCustomId("eagle")
//           .setLabel("Eagle")
//           .setStyle("SECONDARY")
//           .setEmoji("980510176362790982")
//       )
//       .addComponents(
//         new MessageButton()
//           .setCustomId("coin")
//           .setLabel("Tails")
//           .setStyle("SECONDARY")
//           .setEmoji("980510176543121468")
//       );
//     const embed = new MessageEmbed()
//       .setColor("RANDOM")
//       .setDescription("> Choose the options that are right for you!");
//     msg.reply({
//       allowedMentions: { repliedUser: false },
//       embeds: [embed],
//       components: [row],
//     });

//     const filter = (i) =>
//       (i.customId === "eagle" && i.user.id === msg.author.id) ||
//       (i.customId === "coin" && i.user.id === msg.author.id);

//     const collector = msg.channel.createMessageComponentCollector({
//       filter,
//       time: 15000,
//     });

//     const monet = ["eagle", "tails"];
//     const wypadlobot = monet[Math.floor(Math.random() * monet.length)];

//     collector.on("collect", async (i) => {
//       if (i.customId === "eagle") {
//         if ("eagle" === wypadlobot) {
//           await i.update({
//             embeds: [
//               new MessageEmbed()
//                 .setColor("#11f01c")
//                 .setDescription(
//                   `> Your choose: <:eagle:980510176362790982> **Eagle** \n> Fell out: <:eagle:980510176362790982> **Eagle**\n> Winners: <@${msg.author.id}>!`
//                 ),
//             ],
//             components: [],
//           });
//         }
//         if (wypadlobot === "tails") {
//           await i.update({
//             embeds: [
//               new MessageEmbed()
//                 .setColor("#f01111")
//                 .setDescription(
//                   `> Your choose: <:eagle:980510176362790982> **Eagle** \n> Fell out: <:coin:980510176543121468> **Tails**\n> Winners: **Nobody won!**`
//                 ),
//             ],
//             components: [],
//           });
//         }
//       }
//       if (i.customId === "coin") {
//         if ("tails" === wypadlobot) {
//           await i.update({
//             embeds: [
//               new MessageEmbed()
//                 .setColor("#11f01c")
//                 .setDescription(
//                   `> Your choose: <:coin:980510176543121468> **Tails** \n> Fell out: <:coin:980510176543121468> **Tails**\n> Winners: <@${msg.author.id}>!`
//                 ),
//             ],
//             components: [],
//           });
//         }
//         if (wypadlobot === "eagle") {
//           await i.update({
//             embeds: [
//               new MessageEmbed()
//                 .setColor("#f01111")
//                 .setDescription(
//                   `> Your choose: <:coin:980510176543121468> **Tails** \n> Fell out: <:eagle:980510176362790982> **Eagle**\n> Winners: **Nobody won!**`
//                 ),
//             ],
//             components: [],
//           });
//         }
//       }
//     });
//   },
// };
