const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  run: async (client, msg, args) => {
    if (!config.devs.includes(msg.author.id)) return;

    let toEval = args.join(" ");
    if (!toEval) toEval = "client";

    const nlPattern = new RegExp("!!NL!!", "g");

    let result, hrDiff;
    const hrStart = process.hrtime();

    result = await eval(toEval);
    hrDiff = process.hrtime(hrStart);

    const inspected = inspect(result, { depth: 0 })
      .replace(nlPattern, "\n")
      .replace(
        client.token,
        "iks de nie ma tak łatwo tokenu, nie takie numery mordooo"
      );

    const embedgut = new MessageEmbed()
      .setTitle("Eval")
      .setDescription(
        `Kod:\`\`\`js\n${toEval} \n\`\`\`\n Zwrócona Wartość: *Czas odpowiedzi: ${
          hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""
        }${
          hrDiff[1] / 1000000
        }ms.*\`\`\`js\n${inspected} \n\`\`\`\n Typ:\`\`\`yaml\n${typeof result}\n\`\`\``
      )
      .setColor(`GREEN`)
      .setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL()}`);
    msg.channel.send({
      allowedMentions: { repliedUser: false },
      embeds: [embedgut],
    });
  },
};
