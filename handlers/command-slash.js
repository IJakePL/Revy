const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("node:fs");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands-slash")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands-slash/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(
  "OTU0NDU5ODMxMDIzMDU0OTU5.YjTb_A.gRd0rLcKvGK2MuRa_ssWd1Gxi4s"
);

(async () => {
  try {
    await rest.put(Routes.applicationCommands("954459831023054959"), {
      body: commands,
    });
  } catch (error) {
    console.error(error);
  }
})();
