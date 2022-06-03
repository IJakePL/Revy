const { Snake } = require("discord-gamecord");

module.exports = {
  name: "snake",
  run: async (client, msg, args) => {
    new Snake({
      message: msg,
      embed: {
        title: "Snake!",
        color: "RANDOM",
        OverTitle: "Loser",
      },
      snake: { head: "🐍", body: "🟢", tail: "🟢" },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        right: "➡️",
        down: "⬇️",
        left: "⬅️",
      },
      othersMessage: "You are not authorized to use the buttons!",
    }).startGame();
  },
};
