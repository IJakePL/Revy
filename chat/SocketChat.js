const { messages, server } = require("./ServerChat");
const socket = require("socket.io");
const got = require("got");
const { toHTML } = require("discord-markdown");
const { textEmoji } = require("markdown-to-text-emoji");

const metascraper = require("metascraper")([
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
]);

const io = socket(server);

io.on("connection", (clientSocket) => {
  console.log(
    "[RevyBot.fun]: [ SOCKET ]   >>>   Wykonane połączenie z gniazdem",
    clientSocket.id
  );

  clientSocket.on("chat", async (data) => {
    await setEmbed(data);

    data.html = toHTML(textEmoji(data.message));

    const newIndex = messages.push(data) - 1;
    setTimeout(() => messages.splice(newIndex, 1), 5 * 60 * 1000);

    io.sockets.emit("chat", data);
  });

  clientSocket.on("typing", (data) => {
    clientSocket.broadcast.emit("typing", data);
  });
});
