const { TicTacToe } = require("discord-gamecord");

module.exports = {
  name: "tictactoe",
  run: async (client, msg, args) => {
    const member = msg.mentions.users.first();

    if (!member) {
      msg.react("<:reject:928580897559707658>");
      return;
    }
    new TicTacToe({
      message: msg,
      slash_command: false,
      opponent: msg.mentions.users.first(),
      embed: {
        title: "Tic Tac Toe",
        overTitle: "Game Over",
        color: "#5865F2",
      },
      oEmoji: "🔵",
      xEmoji: "❌",
      blankEmoji: "➖",
      oColor: "PRIMARY",
      xColor: "DANGER",
      waitMessage: "Waiting for the opponent...",
      turnMessage: "{emoji} | Its now **{player}** turn!",
      askMessage:
        "Hey {opponent}, {challenger} challenged you for a game of Tic Tac Toe!",
      cancelMessage:
        "Looks like they refused to have a game of Tic Tac Toe. :(",
      timeEndMessage: "Since the opponent didnt answer, i dropped the game!",
      drawMessage: "It was a draw!",
      winMessage: "{emoji} | **{winner}** won the game!",
      gameEndMessage: "The game went unfinished :(",
    }).startGame();
  },
};
