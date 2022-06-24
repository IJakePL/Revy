(figlet = require("figlet")),
  (util = require("util")),
  (figletAsync = util.promisify(figlet));

module.exports = {
  name: "ascii",
  run: async (client, msg, args) => {
    const text = args.join(" ");
    if (!text || text.length > 15) {
      return msg.reply({
        content: "The text should not exceed 15 characters",
        allowedMentions: { repliedUser: false },
      });
    }
    const rendered = await figletAsync(text);
    msg.reply({
      content: "```" + rendered + "```",
      allowedMentions: { repliedUser: false },
    });
  },
};
