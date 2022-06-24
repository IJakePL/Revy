const Event = require("./event");
const logs = require("../../data/logs");

module.exports = class extends Event {
  on = "messageCreate";

  async invoke(msg) {
    if (!msg.guild || msg.author.bot) return;

    await logs.add(msg.guild.id, "messages");
  }
};
