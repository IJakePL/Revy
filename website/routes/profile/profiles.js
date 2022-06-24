const app = require("express").Router();
const botsdata = require("../../database/models/botlist/bots.js");
const servers = require("../../database/models/servers/server.js");
const client = global.Client;

const profiledata = require("../../database/models/profile.js");
const banSchema = require("../../database/models/site-ban.js");
app.get("/:userID", async (req, res) => {
  client.users.fetch(req.params.userID).then(async (a) => {
    const pdata = await profiledata.findOne({
      userID: a.id,
    });
    let banVerisi = await banSchema.findOne({ user: req.params.userID });
    res.render("profile/profile.ejs", {
      bot: global.Client,
      path: req.path,
      config: global.config,
      user: req.isAuthenticated() ? req.user : null,
      req: req,
      roles: global.config.server.roles,
      channels: global.config.server.channels,
      pdata: pdata,
      member: a,
      bannedCheck: banVerisi,
    });
  });
});

module.exports = app;
