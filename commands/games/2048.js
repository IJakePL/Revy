const { TwoZeroFourEight } = require("discord-gamecord");

module.exports = {
  name: "2048",
  run: async (client, msg, args) => {
    new TwoZeroFourEight({
      message: msg,
      slash_command: false,
      embed: {
        title: "2048 Game",
        color: "009dff",
        overTitle: "Game Over!",
        winTitle: "You Win!",
      },
      emojis: {
        up: "⬆️",
        right: "➡️",
        down: "⬇️",
        left: "⬅️",
      },
      othersMessage: "false",
    }).startGame();
  },
};
