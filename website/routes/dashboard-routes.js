const express = require("express");
const guilds = require("../../data/guilds");
const logs = require("../../data/logs");
const client = require("../../start");
const { validateGuild } = require("../modules/middleware");

const router = express.Router();

router.get("/guilds", (req, res) => res.render("dashboard/index"));

router.get("/guilds/:id", validateGuild, async (req, res) =>
  res.render("dashboard/show", {
    savedGuild: await guilds.get(req.params.id),
    logs: await logs.get(req.params.id),
    owner: await client.guilds.cache.get(req.params.id).fetchOwner(),
    users: client.users.cache,
    key: res.cookies.get("key"),
  })
);

router.put("/guilds/:id/:module", validateGuild, async (req, res) => {
  try {
    const { id, module } = req.params;

    const savedGuild = await guilds.get(id);
    savedGuild[module] = req.body;
    await savedGuild.save();

    res.redirect(`/servers/${id}`);
  } catch {
    res.render("errors/400");
  }
});

module.exports = router;
