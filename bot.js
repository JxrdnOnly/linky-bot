const Message = require("./models/message");
const Discord = require("discord.js");

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Started discord attachment scraper");
});

client.on("message", (discordMessage) => {
  let urlList = [];
  discordMessage.attachments.forEach((attachment) =>
    urlList.push(attachment.url)
  );

  const message = new Message({
    attachments: urlList,
    date: new Date(),
  });

  message.save((error, message) => {
    if (error) {
      console.error(error);
    }
    console.log(message);
  });
});

client.login(process.env.BOT_TOKEN);
