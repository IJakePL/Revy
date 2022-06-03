const { Slots } = require("discord-gamecord");

module.exports = {
  name: "slots",
  run: async (client, msg, args) => {
    new Slots({
      message: msg,
      slash_command: false,
      embed: {
        title: "🎰 Slot Machine",
        color: "#5865F2",
      },
    }).startGame();
  },
};
