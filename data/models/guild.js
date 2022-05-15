const { model } = require("mongoose");

class General {
  prefix = "^";
}

module.exports = model("guild", {
  _id: String,
  general: { type: Object, default: new General() },
});
