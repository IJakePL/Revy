const express = require("express");

const app = express();
const server = app.listen(3001, () =>
  console.log(
    "[RevyBot.fun]: [ CHAT ]       >>>   Serwer chatu został uruchomiony na porcie: 3001"
  )
);

app.use(express.static("public"));

const messages = [];

app.get("/messages", (req, res) => res.json(messages));

module.exports.server = server;
module.exports.messages = messages;

require("./SocketChat");
