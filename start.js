// import
const Discord = require("discord.js");
const { Client, Intents, MessageEmbed, Collection } = require("discord.js");
const { ReactionCollector } = require("discord.js-collector");
const client = new Client({ intents: 32767 });
const config = require("./config.json");
const fs = require("fs");

client.login(config.bot.token);

client.on("ready", async (msg) => {
  console.log(`[ ROBOT ]      >>>   Zalogowano jako ${client.user.tag}`);
  client.user.setPresence({
    activities: [
      {
        name: `/help`,
      },
    ],
  });
});

client.on("guildCreate", (guild) => {
  client.user.setPresence({
    activities: [
      {
        name: `/help`,
      },
    ],
  });
});

client.on("guildDelete", (guild) => {
  client.user.setPresence({
    activities: [
      {
        name: `/help`,
      },
    ],
  });
});

module.exports = client;

// ---------------------- DATA BASE -------------------------
const mongoose = require("mongoose");

mongoose.connect(
  config.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) =>
    error
      ? console.log("[ DATABASE ]   >>>   Nie połączono z bazą danych!")
      : console.log("[ DATABASE ]   >>>   Połączono z bazą danych!")
);

// -------------------------------- OZNACZENIE ------------------------------------
const guilds = require("./data/guilds");

client.on("messageCreate", async (message) => {
  if (
    message.content === `<@!${client.user.id}>` ||
    message.content === `<@${client.user.id}>`
  ) {
    const savedGuild = await guilds.get(message.guild.id);
    const prefix = savedGuild.general.prefix;
    const oznacznie = new MessageEmbed()
      .setDescription(
        "My prefix is: ` " +
          prefix +
          " `\nStart the adventure: ` " +
          prefix +
          "help `\nSlash command ` /help `" +
          "\n\n***Useful links:***\n<:question:928580930887626782> **[Server Support](https://discord.gg/s5ZE2EHtQx)**\n<:repair:928580897341575188> **[Dashboard](https://revybot.fun/login)**\n<:globus:928580897182199908> **[Website](https://revybot.fun)**\n<:link:928580931193806848> **[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands)**"
      )
      .setColor("#FE7D35")
      .setFooter({ text: "Version: Beta 0.2" });
    return message.reply({
      content: "**Revy - Your Discord Bot!**",
      embeds: [oznacznie],
      allowedMentions: { repliedUser: false },
    });
  }
});

// ------------------------------ SLASH MUZYKA -------------------------------
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const player = new Player(client);
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

player.on("error", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});
player.on("connectionError", (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

player.on("trackAdd", (queue, track) => {
  queue.metadata.channel.send(
    `<:emoji_2:968243082699092049> Music **${track.title}** has been added to the queue!`
  );
});

const commands = [
  {
    name: "help",
    description: "Check all slash commands!",
  },
  {
    name: "play",
    description: "Start listening to music!",
    options: [
      {
        name: "link",
        description: "The song you want to play!",
        type: "3",
        required: true,
      },
    ],
  },
  {
    name: "volume",
    description: "Set the music volume!",
    options: [
      {
        name: "value",
        type: "4",
        description: "Only 0-100 can be set",
        required: false,
      },
    ],
  },
  {
    name: "loop",
    description: "Sets loop mode",
    options: [
      {
        name: "mode",
        type: "4",
        description: "Loop type",
        required: true,
        choices: [
          {
            name: "Off",
            value: QueueRepeatMode.OFF,
          },
          {
            name: "Track",
            value: QueueRepeatMode.TRACK,
          },
          {
            name: "Queue",
            value: QueueRepeatMode.QUEUE,
          },
          {
            name: "Autoplay",
            value: QueueRepeatMode.AUTOPLAY,
          },
        ],
      },
    ],
  },
  {
    name: "skip",
    description: "Skip to the current song",
  },
  {
    name: "pause",
    description: "Pause the current song",
  },
  {
    name: "resume",
    description: "Resume the current song",
  },
  {
    name: "stop",
    description: "Stop the player",
  },
];

const rest = new REST({ version: "9" }).setToken(
  "OTU0NDU5ODMxMDIzMDU0OTU5.YjTb_A.gRd0rLcKvGK2MuRa_ssWd1Gxi4s"
);

(async () => {
  try {
    console.log(
      "[ SLASH ]      >>>   Rozpoczęto odświeżanie poleceń aplikacji [/]."
    );

    await rest.put(Routes.applicationCommands("954459831023054959"), {
      body: commands,
    });

    console.log(
      "[ SLASH ]      >>>   Pomyślnie przeładowano polecenia aplikacji [/]."
    );
  } catch (error) {
    console.error(error);
  }
})();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "help") {
    const embed = new MessageEmbed()
      .setDescription(
        "**You made a request for help, according to your orders I will give you all the help you need. If my help turns out to be ineffective, contact our support server for more tips and help from administration**.\n\nYou are currently in the slash command zone, below are all the commands that are listed under [** `/` **] if one does not work, go to the support server and we will take a look at the matter\n\n<:emoji_2:968243082699092049> - Music  (**7**)\n **` /play `** | **` /stop `** | **` /resume `** | **` /volume `** | **` /loop `** | **` /pause `** | **` /skip `**"
      )
      .setColor("#FE7D35")
      .setFooter({ text: "Version: Alpha 0.1" });
    return interaction.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  }
  if (interaction.commandName === "play") {
    if (!interaction.member.voice.channelId)
      return await interaction.followUp({
        content: "You are not in a voice channel!",
      });
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.followUp({
        content: "You are not in my voice channel!",
      });
    const query = interaction.options.get("link").value;
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.followUp({
        content: "Could not join your voice channel!",
      });
    }
    await interaction.deferReply();
    const track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `<:reject:928580897559707658> Sound **${query}** no results were found!`,
      });

    queue.play(track);

    return await interaction.followUp({
      content: `<:emoji_2:968243082699092049> I'm loading the track: **${track.title}**!`,
    });
  } else if (interaction.commandName === "volume") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    const vol = interaction.options.get("wartość");
    if (!vol)
      return void interaction.followUp({
        content: `<:emoji_10:968243448694046850> Current volume is **${queue.volume}**%!`,
      });
    if (vol.value < 0 || vol.value > 100)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> Volume range must be 0-100",
      });
    const success = queue.setVolume(vol.value);
    return void interaction.followUp({
      content: success
        ? `<:accept:928580897450639361> Volume set to **${vol.value}%**!`
        : "<:reject:928580897559707658> Something went wrong!",
    });
  } else if (interaction.commandName === "skip") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    const currentTrack = queue.current;
    const success = queue.skip();
    return void interaction.followUp({
      content: success
        ? `<:accept:928580897450639361> Skipped **${currentTrack}**!`
        : "<:reject:928580897559707658> Something went wrong!",
    });
  } else if (interaction.commandName === "pause") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    const paused = queue.setPaused(true);
    return void interaction.followUp({
      content: paused
        ? "<:accept:928580897450639361> Paused!"
        : "<:reject:928580897559707658> Something went wrong!",
    });
  } else if (interaction.commandName === "resume") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    const paused = queue.setPaused(false);
    return void interaction.followUp({
      content: !paused
        ? "<:reject:928580897559707658> Something went wrong!"
        : "<:online:935566886488379503> Resume!",
    });
  } else if (interaction.commandName === "stop") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    queue.destroy();
    return void interaction.followUp({
      content: "<:accept:928580897450639361> Stopped the player!",
    });
  } else if (interaction.commandName === "loop") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    const loopMode = interaction.options.get("mode").value;
    const success = queue.setRepeatMode(loopMode);
    return void interaction.followUp({
      content: success
        ? `<:online:935566886488379503> Updated loop mode!`
        : "<:reject:928580897559707658> Could not update loop mode!",
    });
  }
});

require("./website/site");
