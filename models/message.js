const { ClientVoiceManager, MessageFlags } = require("discord.js");
const mongoose = require("mongoose");

mongoose.connect(process.env.CON_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected");
});

const messageSchema = new mongoose.Schema({
  attachments: Array,
  date: Date,
});

module.exports = mongoose.model("Message", messageSchema);
