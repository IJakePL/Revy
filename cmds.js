// import
const { QueueRepeatMode } = require("discord-player");

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
    name: "radio",
    description: "Start listening to your favorite radio",
    options: [
      {
        name: "status",
        type: "3",
        description: "Manage radio availability",
        required: false,
        choices: [
          {
            name: "ON",
            value: "on",
          },
          {
            name: "RELOAD",
            value: "reload",
          },
          {
            name: "OFF",
            value: "off",
          },
        ],
      },
      {
        name: "channels",
        channel_types: "2",
        type: "7",
        required: false,
        description:
          "Select the channel on which the radio should always be played",
      },
      {
        name: "station",
        type: "3",
        description: "Choose your favorite radio",
        required: false,
        choices: [
          {
            name: "RMF MAXXX",
            value: "RMFMAXXX",
          },
          {
            name: "RMF FM",
            value: "RMFFM",
          },
          {
            name: "RADIO ESKA",
            value: "ESKA",
          },
        ],
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
    name: "queue",
    description: "See the queue",
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
    name: "np",
    description: "Now Playing",
  },
  {
    name: "stop",
    description: "Stop the player",
  },
  {
    name: "ping",
    description: "Shows bot latency",
  },
  {
    name: "news",
    description: "See what's new we have prepared!",
  },
  {
    name: "bug",
    description: "Please report the error you encountered",
    options: [
      {
        name: "reason",
        type: "3",
        description:
          "Write what you encountered in the error, what was the command.",
        required: true,
      },
    ],
  },
  {
    name: "report",
    description: "Report user",
    options: [
      {
        name: "user",
        description: "Mark user for report",
        type: "6",
        required: true,
      },
      {
        name: "reason",
        description: "Reason for reporting the user",
        type: "3",
        required: true,
      },
    ],
  },
];

module.exports = commands;
