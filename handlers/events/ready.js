const Event = require("./event");
const client = require("../../start");

module.exports = class extends Event {
  on = "ready";

  invoke() {
    console.log(
      `[RevyBot.fun]: [ ROBOT ]      >>>   Zalogowano jako ${client.user.tag}`
    );
  }
};
