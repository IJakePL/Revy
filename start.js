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
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
} = require("@discordjs/voice");
const db = require("quick.db");

const os = require("os");
const cpuStat = require("cpu-stat");

client.login(config.bot.token);

client.on("ready", (msg) => {
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

client.on("channelDelete", (channel) => {
  if (channel.id === db.get(`radio_channel_${channel.guild.id}`)) {
    db.delete(`radio_channel_${channel.guild.id}`);
    db.delete(`radio_station_${channel.guild.id}`);
  }
});

// -----------------------------------------------------------------------------
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

const guilds = require("./data/guilds");

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

module.exports = client;

// ---------------------- DATA BASE -------------------------
const mongoose = require("mongoose");

mongoose.connect(
  process.env.MongoDb || config.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) =>
    error
      ? console.log(
          "[RevyBot.fun]: [ DATABASE ]   >>>   Nie połączono z bazą danych."
        )
      : console.log(
          "[RevyBot.fun]: [ DATABASE ]   >>>   Połączono z bazą danych."
        )
);

// -------------------------------- OZNACZENIE ------------------------------------

client.on("messageCreate", async (message) => {
  if (
    message.content === `<@!${client.user.id}>` ||
    message.content === `<@${client.user.id}>`
  ) {
    const savedGuild = await guilds.get(message.guild.id);
    const prefix = savedGuild.general.prefix;
    const roww = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Please select the appropriate category")
        .addOptions([
          {
            label: "About the Revy",
            description: "Click",
            emoji: "928580897148633099",
            value: "about",
          },
          {
            label: "FAQ",
            description: "Click",
            emoji: "928580930887626782",
            value: "faq",
          },
          {
            label: "Staff",
            description: "Click",
            emoji: "928580931344797717",
            value: "staff",
          },
        ])
    );

    const filter = (i) =>
      i.customId === "select" && i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 30000,
    });
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Server Support")
        .setURL("https://discord.gg/zqtadU9Ecm")
        .setStyle("LINK"),
      new MessageButton()
        .setLabel("Invite Bot")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands"
        )
        .setStyle("LINK")
    );
    const oznacznie = new MessageEmbed()
      .setAuthor({
        name: "Hey, I detected my mention!",
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `Hello <@${message.author.id}>, how can I help you.\nBelow you will find the menu and see what interests you.\n`
      )
      .setColor("#2f3136")
      .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" });
    await message.reply({
      embeds: [oznacznie],
      allowedMentions: { repliedUser: false },
      components: [row, roww],
    });

    const status = {
      online: "<:online:935566886488379503>",
      idle: "<:idle:935566955405008916>",
      dnd: "<:dnd:935567025944805396>",
      offline: "<:invisible:935567128285823057>",
      null: "<:invisible:935567128285823057>",
    };

    const guild = client.guilds.cache.get("932639653046145035");
    const ghost =
      status[
        guild.members.cache.get("427505231937404942").presence?.status ??
          "offline"
      ];
    const bigus =
      status[
        guild.members.cache.get("960958142336872518").presence?.status ??
          "offline"
      ];
    const blokunsy =
      status[
        guild.members.cache.get("964086735422230538").presence?.status ??
          "offline"
      ];

    collector.on("collect", async (i) => {
      if (i.customId === "select") {
        if (i.values[0] === "about") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: "Find out a little more about me...",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription("XD COŚ SIE TU WSTAWI")
                .addField(
                  "Information",
                  `<:crown:928580931109941252> Project creator: [,Ghost#0402](https://discord.com/users/427505231937404942)\n<:edit:928580897584853022> Prefix: \` ${prefix} \`\n<:search:928580896502726677> Slash: \` / \`\n<:globus:928580897182199908> Website: https://revybot.fun/`
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "staff") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: "Staff Revy",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription("Administracja i chuj")
                .addField(
                  "Revy Staff",
                  `<:ghost0402:983771846312861746> [,Ghost#0402](https://discord.com/users/427505231937404942) ( ${ghost} )`
                )
                .addField(
                  "Manager Team",
                  `<:BigSplashDev:985502937923088414> [! BigSplash Dev#2115](https://discord.com/users/960958142336872518) ( ${bigus} )\n<:blookusnypfp:985487520542388275> [Blookusny#0001](https://discord.com/users/964086735422230538) ( ${blokunsy} )`
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
      }
    });
  }
});

// ------------------------------ SLASH MUZYKA -------------------------------

const { Player } = require("discord-player");
const player = new Player(client);

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "help") {
    const savedGuild = await guilds.get(interaction.guild.id);
    const prefix = savedGuild.general.prefix;
    const roww = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Please select the appropriate category")
        .addOptions([
          // {
          //   label: "Moderation",
          //   description: "Click",
          //   emoji: "928580931344797717",
          //   value: "mod",
          // },
          // {
          //   label: "4Fun",
          //   description: "Click",
          //   emoji: "928580897471623178",
          //   value: "fun",
          // },
          {
            label: "Information",
            description: "Click",
            emoji: "968243549214748712",
            value: "info",
          },
          // {
          //   label: "Economy",
          //   description: "Click",
          //   emoji: "968244360959361054",
          //   value: "eco",
          // },
          {
            label: "Music",
            description: "Click",
            emoji: "968243082699092049",
            value: "music",
          },
        ])
    );

    const filter = (i) =>
      i.customId === "select" && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Website")
        .setURL("https://revybot.fun/")
        .setStyle("LINK"),
      new MessageButton()
        .setLabel("Invite Bot")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=954459831023054959&permissions=8&scope=bot%20applications.commands"
        )
        .setStyle("LINK")
    );
    const embed = new MessageEmbed()
      .setTitle("Basic help")
      .setDescription(
        "<:star:928580930879225866> Revy is a bot that will help you in the professional management of your server" +
          `\n\n<:emoji_26:978709532584869941> <:globus:928580897182199908>・My prefix is: \` ${prefix} \`\n<:emoji_26:978709532584869941> <:edit:928580897584853022>・Slash command: \` / \`\n<:emoji_26:978709532584869941> <:acc:928580897559683142>・Servers: ${client.guilds.cache.size}\n<:emoji_27:978709532605820939> <:user:928580896968306698>・Users: ${client.users.cache.size}`
      )
      .setColor("#2f3136")
      .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" });
    await interaction.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
      components: [row, roww],
    });
    collector.on("collect", async (i) => {
      if (i.customId === "select") {
        if (i.values[0] === "mod") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Moderation commands")
                .setDescription("Soon")
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "eco") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Economy commands")
                .setDescription("Soon")
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "info") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Information commands")
                .setDescription(
                  "<:user:928580896968306698> **` Users (4) `**\n<:emoji_26:978709532584869941> **/user [user]** - User information\n<:emoji_26:978709532584869941> **/ping** - Shows bot latency\n<:emoji_26:978709532584869941> **/server** - All information about the server\n<:emoji_27:978709532605820939> **/info** - Information about the bot"
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
        if (i.values[0] === "music") {
          i.update({
            embeds: [
              new MessageEmbed()
                .setTitle("Music commands")
                .setDescription(
                  "<:voice:928580897651953674> **` Users (9) `**\n<:emoji_26:978709532584869941> **/play** - Start listening to music\n<:emoji_26:978709532584869941> **/stop** - Stop the player\n<:emoji_26:978709532584869941> **/queue** - See the queue\n<:emoji_26:978709532584869941> **/volume** - Set the music volume\n<:emoji_26:978709532584869941> **/loop** - Sets loop mode\n<:emoji_26:978709532584869941> **/skip** - Skip to the current song\n<:emoji_26:978709532584869941> **/pause** - Pause the current song\n<:emoji_26:978709532584869941> **/resume** - Resume the current song\n<:emoji_27:978709532605820939> **/np** - Now Playing\n\n<:staff:928580931344797717> **` Administrator (1) `**\n<:emoji_27:978709532605820939> **/radio** - Start listening to your favorite radio"
                )
                .setColor("#2f3136")
                .setFooter({ text: "Revy © 2022 ・ Version: Beta 0.3" }),
            ],
            allowedMentions: { repliedUser: false },
            components: [row, roww],
          });
        }
      }
    });
  }
  if (interaction.commandName === "ping") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guild);
    return void interaction.followUp({
      embeds: [
        {
          title: "Latency",
          fields: [
            {
              name: "<:status:928580897148633099> Bot Latency",
              value: `- \`${Math.round(client.ws.ping)}ms\``,
            },
            {
              name: "<:download:928580930866663475> MongoDB",
              value: `- \`${mongoose.connection.readyState}ms\``,
            },
            {
              name: "<:voice:928580897651953674> Voice Latency",
              value: !queue
                ? "- `N/A`"
                : `- UDP: \`${
                    queue.connection.voiceConnection.ping.udp ?? "`N/A"
                  }\`ms\n- WebSocket: \`${
                    queue.connection.voiceConnection.ping.ws ?? "`N/A`"
                  }\`ms`,
            },
          ],
          color: "#2f3136",
        },
      ],
    });
  }

  if (interaction.commandName === "radio") {
    const station = interaction.options.get("station");
    const channel = interaction.options.get("channels");
    const status = interaction.options.get("status");
    if (!status && !channel && !station) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `> The radio is now on: **${db.get(
                `radio_station_${interaction.guild.id}`
              )}**\n> The radio is set to the channel **<#${db.get(
                `radio_channel_${interaction.guild.id}`
              )}>**`
            ),
        ],
      });
    }
    if (status) {
      if (status.value === "reload") {
        if (db.get(`radio_${interaction.guild.id}`) === "true") {
          if (db.get(`radio_station_${interaction.guild.id}`) === "RMFMAXXX") {
            await interaction.deferReply();
            const connection = joinVoiceChannel({
              channelId: db.get(`radio_channel_${interaction.guild.id}`),
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(
              "http://217.74.72.10:8000/rmf_maxxx",
              {
                inlineVolume: true,
              }
            );

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor("#2f3136")
                  .setTitle("RELOAD")
                  .setDescription(
                    "> Currently, the **RMF MAXXX** radio will be on\n> The channel on which the music will be played: <#" +
                      db.get(`radio_channel_${interaction.guild.id}`) +
                      ">"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/978643729676111872/984542506660286484/rmf-maxxx.png"
                  ),
              ],
            });
          }

          if (db.get(`radio_station_${interaction.guild.id}`) === "RMFFM") {
            await interaction.deferReply();
            const connection = joinVoiceChannel({
              channelId: db.get(`radio_channel_${interaction.guild.id}`),
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(
              "http://217.74.72.10:8000/rmf_fm",
              {
                inlineVolume: true,
              }
            );

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor("#2f3136")
                  .setTitle("RELOAD")
                  .setDescription(
                    "> Currently, the **RMF FM** radio will be on\n> The channel on which the music will be played: <#" +
                      db.get(`radio_channel_${interaction.guild.id}`) +
                      ">"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/978643729676111872/984542790140710962/rmf-fm.png"
                  ),
              ],
            });
          }

          if (db.get(`radio_station_${interaction.guild.id}`) === "ESKA") {
            await interaction.deferReply();
            const connection = joinVoiceChannel({
              channelId: db.get(`radio_channel_${interaction.guild.id}`),
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(
              "https://ext03.ic.smcdn.pl/2380-1.mp3",
              {
                inlineVolume: true,
              }
            );

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor("#2f3136")
                  .setTitle("RELOAD")
                  .setDescription(
                    "> Currently, the **RADIO ESKA** radio will be on\n> The channel on which the music will be played: <#" +
                      db.get(`radio_channel_${interaction.guild.id}`) +
                      ">"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/978643729676111872/984509912770031687/eska.png"
                  ),
              ],
            });
          }
        }
      }
      if (interaction.member.permissions.has("ADMINISTRATOR")) {
        if (status.value === "on") {
          if (db.get(`radio_${interaction.guild.id}`) === "true") {
            return void interaction.reply({
              content: "<:reject:928580897559707658> The radio is already on! ",
            });
          }
          db.set(`radio_${interaction.guild.id}`, "true");
          if (db.get(`radio_station_${interaction.guild.id}`) === "RMFMAXXX") {
            const connection = joinVoiceChannel({
              channelId: db.get(`radio_channel_${interaction.guild.id}`),
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(
              "http://217.74.72.10:8000/rmf_maxxx",
              {
                inlineVolume: true,
              }
            );

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#2f3136")
                  .setDescription(
                    "> Currently, the **RMF MAXXX** radio will be on\n> The channel on which the music will be played: <#" +
                      db.get(`radio_channel_${interaction.guild.id}`) +
                      ">"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/978643729676111872/984542506660286484/rmf-maxxx.png"
                  ),
              ],
            });
          }

          if (db.get(`radio_station_${interaction.guild.id}`) === "RMFFM") {
            const connection = joinVoiceChannel({
              channelId: db.get(`radio_channel_${interaction.guild.id}`),
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(
              "http://217.74.72.10:8000/rmf_fm",
              {
                inlineVolume: true,
              }
            );

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#2f3136")
                  .setDescription(
                    "> Currently, the **RMF FM** radio will be on\n> The channel on which the music will be played: <#" +
                      db.get(`radio_channel_${interaction.guild.id}`) +
                      ">"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/978643729676111872/984542790140710962/rmf-fm.png"
                  ),
              ],
            });
          }

          if (db.get(`radio_station_${interaction.guild.id}`) === "ESKA") {
            const connection = joinVoiceChannel({
              channelId: db.get(`radio_channel_${interaction.guild.id}`),
              guildId: interaction.guild.id,
              adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(
              "https://ext03.ic.smcdn.pl/2380-1.mp3",
              {
                inlineVolume: true,
              }
            );

            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);

            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#2f3136")
                  .setDescription(
                    "> Currently, the **RADIO ESKA** radio will be on\n> The channel on which the music will be played: <#" +
                      db.get(`radio_channel_${interaction.guild.id}`) +
                      ">"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/978643729676111872/984509912770031687/eska.png"
                  ),
              ],
            });
          }
        }
        if (status.value === "off") {
          if (db.get(`radio_${interaction.guild.id}`) === "false") {
            return void interaction.reply({
              content:
                "<:reject:928580897559707658> The radio is already turned off! ",
            });
          }
          db.set(`radio_${interaction.guild.id}`, "false");
          const connection = joinVoiceChannel({
            channelId: db.get(`radio_channel_${interaction.guild.id}`),
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
          });
          connection.destroy();
        }
      } else if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        return void interaction.reply({
          content:
            "<:reject:928580897559707658> You do not have administrator permission to use this command!! ",
        });
      }
    }

    if (db.get(`radio_${interaction.guild.id}`) === "false") {
      return void interaction.reply({
        content:
          "<:reject:928580897559707658> You have to turn on the radio first!! ",
      });
    }

    if (channel) {
      const chann =
        interaction.guild.channels.cache.get(channel.value) ||
        interaction.guild.channels.cache.find((x) => x.id === channel.value) ||
        interaction.mentions.channels.first();
      if (chann.type === "GUILD_TEXT") {
        return void interaction.reply({
          content:
            "<:reject:928580897559707658> You need to tag the Voice Channel! ",
        });
      }

      if (chann.type === "GUILD_VOICE") {
        if (channel.value) {
          db.set(`radio_channel_${interaction.guild.id}`, channel.value);
          return void interaction.reply({
            content:
              "The radio channel is successfully set to <#" +
              channel.value +
              ">",
          });
        }
      }
    }
    // <:emoji_26:978709532584869941> **1.** Radio Maxxx\n<:emoji_26:978709532584869941> **2.** RMF FM\n<:emoji_26:978709532584869941> **3.** RMF Classic\n<:emoji_26:978709532584869941> **4.** PR Radio Katowice\n<:emoji_26:978709532584869941> **5.** Planeta FM Warszawa\n<:emoji_26:978709532584869941> **6.** Szczecińskie Radio\n<:emoji_26:978709532584869941> **7.** Radio Fest\n<:emoji_26:978709532584869941> **8.** Radio Kolor\n<:emoji_26:978709532584869941> **9.** Foxy FM\n<:emoji_27:978709532605820939> **10.** Złote Przeboje
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return;
    }

    if (!db.get(`radio_channel_${interaction.guild.id}`)) {
      return void interaction.reply({
        content: "<:reject:928580897559707658> Set the radio channel first!! ",
      });
    }
    if (!station) {
      return;
    }
    if (db.get(`radio_channel_${interaction.guild.id}`)) {
      if (station.value === "RMFMAXXX") {
        const connection = joinVoiceChannel({
          channelId: db.get(`radio_channel_${interaction.guild.id}`),
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(
          "http://217.74.72.10:8000/rmf_maxxx",
          {
            inlineVolume: true,
          }
        );

        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);

        db.set(`radio_${interaction.guild.id}`, "true");
        db.set(`radio_station_${interaction.guild.id}`, "RMFMAXXX");

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(
                "> Currently, the **RMF MAXXX** radio will be on\n> The channel on which the music will be played: <#" +
                  db.get(`radio_channel_${interaction.guild.id}`) +
                  ">"
              )
              .setImage(
                "https://cdn.discordapp.com/attachments/978643729676111872/984542506660286484/rmf-maxxx.png"
              ),
          ],
        });
      }

      if (station.value === "RMFFM") {
        const connection = joinVoiceChannel({
          channelId: db.get(`radio_channel_${interaction.guild.id}`),
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(
          "http://217.74.72.11:8000/rmf_fm",
          {
            inlineVolume: true,
          }
        );

        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);

        db.set(`radio_${interaction.guild.id}`, "true");
        db.set(`radio_station_${interaction.guild.id}`, "RMFFM");

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(
                "> Currently, the **RMF FM** radio will be on\n> The channel on which the music will be played: <#" +
                  db.get(`radio_channel_${interaction.guild.id}`) +
                  ">"
              )
              .setImage(
                "https://cdn.discordapp.com/attachments/978643729676111872/984542790140710962/rmf-fm.png"
              ),
          ],
        });
      }

      if (station.value === "ESKA") {
        const connection = joinVoiceChannel({
          channelId: db.get(`radio_channel_${interaction.guild.id}`),
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(
          "https://ext03.ic.smcdn.pl/2380-1.mp3",
          {
            inlineVolume: true,
          }
        );

        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource);

        db.set(`radio_${interaction.guild.id}`, "true");
        db.set(`radio_station_${interaction.guild.id}`, "ESKA");

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(
                "> Currently, the **RADIO ESKA** radio will be on\n> The channel on which the music will be played: <#" +
                  db.get(`radio_channel_${interaction.guild.id}`) +
                  ">"
              )
              .setImage(
                "https://cdn.discordapp.com/attachments/978643729676111872/984509912770031687/eska.png"
              ),
          ],
        });
      }
    }
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
        `**${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}**mb`,
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
    await interaction.deferReply();

    if (db.get(`radio_${interaction.guild.id}`) === "true") {
      return void interaction.followUp({
        content: "You cannot use this command because the radio is on!",
      });
    }

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      return void interaction.followUp({
        content: "You are not in a voice channel!",
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      return void interaction.followUp({
        content: "You are not in my voice channel!",
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
        ephemeral: true,
      });
    }
    const track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return interaction.followUp({
        content: `<:reject:928580897559707658> Sound **${query}** no results were found!`,
        ephemeral: true,
      });

    queue.play(track);

    return interaction.followUp({
      content: `<:emoji_2:968243082699092049> I'm loading the track: **${track.title}**! Please wait.`,
    });
  } else if (interaction.commandName === "queue") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "❌ | No music is being played!",
      });
    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. **${m.title}** ([link](${m.url}))`;
    });

    return void interaction.followUp({
      embeds: [
        {
          title: "Server Queue",
          description: `${tracks.join("\n")}${
            queue.tracks.length > tracks.length
              ? `\n...${
                  queue.tracks.length - tracks.length === 1
                    ? `${queue.tracks.length - tracks.length} more track`
                    : `${queue.tracks.length - tracks.length} more tracks`
                }`
              : ""
          }`,
          color: 0xff0000,
          fields: [
            {
              name: "Now Playing",
              value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`,
            },
          ],
        },
      ],
    });
  } else if (interaction.commandName === "volume") {
    await interaction.deferReply({ ephemeral: true });
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    const vol = interaction.options.get("value");
    if (!vol)
      return void interaction.followUp({
        content: `<:emoji_10:968243448694046850> Current volume is **${queue.volume}**%!`,
        ephemeral: true,
      });
    if (vol.value < 0 || vol.value > 100)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> Volume range must be 0-100",
        ephemeral: true,
      });
    const success = queue.setVolume(vol.value);
    return void interaction.followUp({
      content: success
        ? `<:accept:928580897450639361> Volume set to **${vol.value}%**!`
        : "<:reject:928580897559707658> Something went wrong!",
      ephemeral: true,
    });
  } else if (interaction.commandName === "skip") {
    await interaction.deferReply({ ephemeral: true });
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    const currentTrack = queue.current;
    const success = queue.skip();
    return void interaction.followUp({
      content: success
        ? `<:accept:928580897450639361> Skipped **${currentTrack}**!`
        : "<:reject:928580897559707658> Something went wrong!",
      ephemeral: true,
    });
  } else if (interaction.commandName === "pause") {
    await interaction.deferReply({ ephemeral: true });
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    const paused = queue.setPaused(true);
    return void interaction.followUp({
      content: paused
        ? "<:accept:928580897450639361> Paused!"
        : "<:reject:928580897559707658> Something went wrong!",
      ephemeral: true,
    });
  } else if (interaction.commandName === "resume") {
    await interaction.deferReply({ ephemeral: true });
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    const paused = queue.setPaused(false);
    return void interaction.followUp({
      content: !paused
        ? "<:reject:928580897559707658> Something went wrong!"
        : "<:online:935566886488379503> Resume!",
      ephemeral: true,
    });
  } else if (interaction.commandName === "stop") {
    await interaction.deferReply({ ephemeral: true });
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    queue.destroy();
    return void interaction.followUp({
      content: "<:accept:928580897450639361> Stopped the player!",
    });
  } else if (interaction.commandName === "loop") {
    await interaction.deferReply({ ephemeral: true });
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    const loopMode = interaction.options.get("mode").value;
    const success = queue.setRepeatMode(loopMode);
    return void interaction.followUp({
      content: success
        ? `<:online:935566886488379503> Updated loop mode!`
        : "<:reject:928580897559707658> Could not update loop mode!",
      ephemeral: true,
    });
  } else if (interaction.commandName === "np") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "<:reject:928580897559707658> No music is being played!",
        ephemeral: true,
      });
    const currentTrack = queue.current;
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Song")
        .setURL(`${currentTrack.url}`)
        .setStyle("LINK")
    );

    return void interaction.followUp({
      embeds: [
        {
          title: "<:emoji_2:968243082699092049> Now Playing",
          description: `<:emoji_26:978709532584869941> Name: **${queue.current.title}**! \n<:emoji_27:978709532605820939> Progress: **${perc.progress} / 100%**`,
          fields: [
            {
              name: "\u200b",
              value: progress,
            },
          ],
          color: "#2f3136",
        },
      ],
      components: [row],
    });
  }
  if (interaction.commandName === "report") {
  }
  if (interaction.commandName === "bug") {
    const reason = interaction.options.get("reason");
    if (!reason) {
      interaction.reply({
        content: "You did not provide a proof of your bug report!",
      });
    }
    if (reason) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor({
              name: "Bug report successfully sent!",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `<:emoji_26:978709532584869941> Reason: **${reason.value}**\n<:emoji_27:978709532605820939> Thanks for submitting! We will look at it and fix it.`
            ),
        ],
      });
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("accept")
          .setLabel("Accept")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId("reject")
          .setLabel("Reject")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("bl")
          .setLabel("Blacklist")
          .setStyle("PRIMARY")
      );
      client.channels.cache.get("987278013181857812").send({
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor({
              name: "New bug report!",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `<:emoji_26:978709532584869941> Reason: **${reason.value}**\n<:emoji_27:978709532605820939> Applicant bug: **${interaction.user.tag}** ( ${interaction.user.id} ).`
            ),
        ],
        components: [row],
      });

      const filter = (i) =>
        i.customId === "accept" ||
        i.customId === "reject" ||
        i.customId === "bl";

      const collector = client.channels.cache
        .get("987278013181857812")
        .createMessageComponentCollector({
          filter,
        });

      collector.on("collect", async (i) => {
        if (i.customId === "accept") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setColor("#3dfc03")
                .setAuthor({
                  name: "The error has been accepted!",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setDescription(
                  `<:emoji_26:978709532584869941> Reason: **${reason.value}**\n<:emoji_26:978709532584869941> He accepted: **${i.user.tag}**\n<:emoji_27:978709532605820939> Applicant bug: **${interaction.user.tag}** ( ${interaction.user.id} ).`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "reject") {
          await i.update({
            embeds: [
              new MessageEmbed()
                .setColor("#fc0303")
                .setAuthor({
                  name: "The error was rejected!",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setDescription(
                  `<:emoji_26:978709532584869941> Reason: **${reason.value}**\n<:emoji_26:978709532584869941> He rejected: **${i.user.tag}**\n<:emoji_27:978709532605820939> Applicant bug: **${interaction.user.tag}** ( ${interaction.user.id} ).`
                ),
            ],
            components: [],
          });
        }
      });
    }
  }
  if (interaction.commandName === "news") {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("perv")
          .setLabel("Previous update")
          .setStyle("SECONDARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("current")
          .setLabel("Current update")
          .setStyle("SECONDARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("next")
          .setLabel("Next update")
          .setStyle("SECONDARY")
      );
    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name: "Changelog Menu",
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor("#2f3136")
      .setDescription(
        "<:emoji_6:968243257274400778> Hello <@" +
          interaction.user.id +
          ">\n<:dot:987048107105746944> Here you can check the latest and current changelog entered into the bot." +
          "\n<:dot:987048107105746944> For a change, you can check out our plans for the next update!"
      );
    await void interaction.reply({ embeds: [embed], components: [row] });

    const filter = (i) =>
      (i.customId === "perv" && i.user.id === interaction.user.id) ||
      (i.customId === "current" && i.user.id === interaction.user.id) ||
      (i.customId === "next" && i.user.id === interaction.user.id);

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "perv") {
        await i.update({
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setAuthor({
                name: "Previous update",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(`N/N!`),
          ],
          components: [row],
        });
      }
      if (i.customId === "current") {
        await i.update({
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setAuthor({
                name: "Current update",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(`N/N!`),
          ],
          components: [row],
        });
      }
      if (i.customId === "next") {
        await i.update({
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setAuthor({
                name: "Next update",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(`N/N!`),
          ],
          components: [row],
        });
      }
    });
  }
});

// -----------------------------------------------------------------------------

process.on("uncaughtException", console.log);

require("./website/site");
require("./slash");
require("./handlers/event-handler");
// require("./chat/ServerChat");
// require("./handlers/command-slash");
