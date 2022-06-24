const fs = require("fs");
const client = require("../start");

const fileNames = fs.readdirSync("./handlers/events");
for (let fileName of fileNames) {
  const Event = require(`./events/${fileName}`);
  const event = new Event();
  if (!event.on) continue;

  client.on(event.on, event.invoke.bind(event));
}
console.log(
  `[RevyBot.fun]: [ EVENTS ]     >>>   Załadowano ${
    fileNames.length - 1
  } eventów.`
);
