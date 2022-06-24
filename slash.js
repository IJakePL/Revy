// import
const config = require("./config.json");
const commands = require("./cmds");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(config.bot.token);

(async () => {
  try {
    await rest.put(Routes.applicationCommands("954459831023054959"), {
      body: commands,
    });

    // await rest.put(Routes.applicationCommands("979415186974847016"), {
    //   body: commands,
    // });

    console.log(
      "[RevyBot.fun]: [ SLASH ]      >>>   Pomyślnie przeładowano polecenia aplikacji [/]."
    );
  } catch (error) {
    console.error(error);
  }
})();
