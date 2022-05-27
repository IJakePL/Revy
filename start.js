// import
const Discord = require("discord.js");
const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  GuildMember,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const { ReactionCollector } = require("discord.js-collector");
const client = new Client({ intents: 32767 });
const config = require("./config.json");
const fs = require("fs");
const moment = require("moment-timezone");

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
  process.env.MongoDb || config.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) =>
    error
      ? console.log("[ DATABASE ]   >>>   Nie połączono z bazą danych!")
      : console.log("[ DATABASE ]   >>>   Połączono z bazą danych!")
);

// ------------------------------- HANDLER --------------------------------------

const guilds = require("./data/guilds");
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.on("messageCreate", async (message) => {
  const savedGuild = await guilds.get(message.guild.id);
  const prefix = savedGuild.general.prefix;

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) message.react("<:reject:928580897559707658>");
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});

// -------------------------------- OZNACZENIE ------------------------------------

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
      .setColor("#468499")
      .setFooter({ text: "Version: Beta 0.3" });
    return message.reply({
      content: "**RevyBot - Your Discord Bot!**",
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
    name: "server",
    description: "View server information!",
  },
  {
    name: "info",
    description: "Bot information!",
  },
  {
    name: "user",
    description: "View user information!",
    options: [
      {
        name: "user",
        description: "Enter user information!",
        type: "6",
        required: false,
      },
    ],
  },
  {
    name: "play",
    description: "Start listening to music!",
    options: [
      {
        name: "song",
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
  {
    name: "ping",
    description: "Shows bot latency",
  },
];

const rest = new REST({ version: "9" }).setToken(
  "OTU0NDU5ODMxMDIzMDU0OTU5.YjTb_A.gRd0rLcKvGK2MuRa_ssWd1Gxi4s"
);

(async () => {
  try {
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
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Website")
        .setURL("https://revybot.fun/")
        .setStyle("LINK"),
      new MessageButton()
        .setLabel("Panel")
        .setURL("https://revybot.fun/login")
        .setStyle("LINK"),
      new MessageButton()
        .setLabel("Invite Bot")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands"
        )
        .setStyle("LINK")
    );
    const embed = new MessageEmbed()
      .setDescription(
        "**You made a request for help, according to your orders I will give you all the help you need. If my help turns out to be ineffective, contact our support server for more tips and help from administration**.\n\nYou are currently in the slash command zone, below are all the commands that are listed under [** `/` **] if one does not work, go to the support server and we will take a look at the matter\n\n<:emoji_13:968243590633500672> - Information (**3**)\n **` /server `** | **` /user `** | **` /info `**\n<:emoji_2:968243082699092049> - Music  (**7**)\n **` /play `** | **` /stop `** | **` /resume `** | **` /volume `** | **` /loop `** | **` /pause `** | **` /skip `**"
      )
      .setColor("#468499")
      .setFooter({ text: "Version: Beta 0.3" });
    return interaction.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
      components: [row],
    });
  }

  if (interaction.commandName === "ping") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guild);

    return void interaction.followUp({
      embeds: [
        {
          title: "⏱️ Latency",
          fields: [
            {
              name: "Bot Latency",
              value: `\`${Math.round(client.ws.ping)}ms\``,
            },
            {
              name: "Voice Latency",
              value: !queue
                ? "N/A"
                : `UDP: \`${
                    queue.connection.voiceConnection.ping.udp ?? "N/A"
                  }\` ms\nWebSocket: \`${
                    queue.connection.voiceConnection.ping.ws ?? "N/A"
                  }\` ms`,
            },
          ],
          color: "#468499",
        },
      ],
    });
  }

  if (interaction.commandName === "server") {
    const verificationLevels = {
      NONE: "0",
      LOW: "1",
      MEDIUM: "2",
      HIGH: "3",
      VERY_HIGH: "4",
    };

    let szyscy = interaction.guild.memberCount;
    let boty = interaction.guild.members.cache.filter(
      (member) => member.user.bot
    ).size;
    let users = szyscy - boty;

    interaction.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        new MessageEmbed()
          .setColor("#468499")
          .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
          .setAuthor({
            name: `${interaction.guild.name}`,
            iconURL: interaction.guild.iconURL({ dynamic: true, size: 512 }),
          })
          .addField(
            `<:id:928580897291268126> Server ID:`,
            `${interaction.guild.id}`,
            true
          )
          .addField(
            `<:globus:928580897182199908> Created On`,
            `**${moment(interaction.guild.createdTimestamp).fromNow()}**`,
            true
          )
          .addField(
            `<:crown:928580931109941252> Owned by`,
            `<@${interaction.guild.ownerId}>`,
            true
          )
          .addField(
            `<:user:928580896968306698>  **Members** (${szyscy})`,
            `**${users}** Users | **${boty}** Bots\n**${
              interaction.guild.premiumSubscriptionCount || "0"
            }** Boosts`,
            true
          )
          .addField(
            `<:discrim:928580931156054016> Channels (` +
              Number(
                interaction.guild.channels.cache.filter(
                  (channel) => channel.type === "GUILD_TEXT"
                ).size +
                  interaction.guild.channels.cache.filter(
                    (channel) => channel.type === "GUILD_VOICE"
                  ).size
              ) +
              ")",
            `**${
              interaction.guild.channels.cache.filter(
                (channel) => channel.type === "GUILD_TEXT"
              ).size
            }** Text | **${
              interaction.guild.channels.cache.filter(
                (channel) => channel.type === "GUILD_VOICE"
              ).size
            }** Voice`,
            true
          )
          .addField(
            `**<:lock:928580930984116234> Verification**`,
            `Level: **${
              verificationLevels[interaction.guild.verificationLevel]
            }**`,
            true
          ),
      ],
      allowedMentions: { repliedUser: false },
    });
  }
  if (interaction.commandName === "user") {
    const user = interaction.options.get("user");
    if (!user) {
      moment.locale(`en`);
      const userinfo = new MessageEmbed()
        .setThumbnail(
          interaction.user.displayAvatarURL({ size: 1024, dynamic: true })
        )
        .setColor("#468499")
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addField(
          "Joined Discord:",
          `${moment(interaction.user.createdAt, "YYYYMMDD").fromNow()}`,
          true
        )
        .addField(
          "Joined Server:",
          `${moment(interaction.member.joinedAt, "YYYYMMDD").fromNow()}`,
          true
        );
      interaction.reply({
        embeds: [userinfo],
        allowedMentions: { repliedUser: false },
      });
    }
    if (user) {
      moment.locale(`en`);
      const userinfo = new MessageEmbed()
        .setThumbnail(user.user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setColor("#468499")
        .setAuthor({
          name: user.user.tag,
          iconURL: user.user.displayAvatarURL({ dynamic: true }),
        })
        .addField(
          "Joined Discord:",
          `${moment(user.user.createdAt, "YYYYMMDD").fromNow()}`,
          true
        )
        .addField(
          "Joined Server:",
          `${moment(user.member.joinedAt, "YYYYMMDD").fromNow()}`,
          true
        );
      interaction.reply({
        embeds: [userinfo],
        allowedMentions: { repliedUser: false },
      });
    }
  }
  if (interaction.commandName === "info") {
    let uptime = client.uptime / 1000;
    let dni = Math.floor(uptime / 86400);
    uptime %= 86400;
    let godziny = Math.floor(uptime / 3600);
    uptime %= 3600;
    let minuty = Math.floor(uptime / 60);
    let sekundy = Math.floor(uptime % 60);
    let czas = `${dni}d, ${godziny}h, ${minuty}m, ${sekundy}s`;

    const bot = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(`Invite Bot`)
        .setStyle(`LINK`)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands`
        )
    );

    const embed = new MessageEmbed()
      .setColor("#468499")
      .addField(
        `<:mention:928580897073152021> Ping:`,
        `**${client.ws.ping}** ms`,
        true
      )
      .addField(`<:status:928580897148633099> Action time`, `${czas}`, true)
      .addField(
        `<:acc:928580897559683142> Servers:`,
        `**${client.guilds.cache.size}**`,
        true
      )
      .addField(
        `<:user:928580896968306698> Users:`,
        `**${client.users.cache.size}**`,
        true
      )
      .addField(
        `<:cloud:928580896947306526> Usage RAM:`,
        `**${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}** mb`,
        true
      )
      .addField(`<:setting:928580896834080788> Version:`, `**Beta 0.3**`, true);
    interaction.reply({
      embeds: [embed],
      components: [bot],
      allowedMentions: { repliedUser: false },
    });
  }
  if (interaction.commandName === "play") {
    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      return void interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      });
    }
    const query = interaction.options.get("song").value;
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
      content: `<:emoji_2:968243082699092049> I'm loading the track: **${track.title}**! Please wait.`,
    });
  } else if (interaction.commandName === "volume") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
      });
    const vol = interaction.options.get("value");
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
