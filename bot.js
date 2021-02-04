const Post = require("./models/post");
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

  const post = new Post({
    attachments: urlList,
    date: new Date(),
  });

  post.save((error, post) => {
    if (error) {
      console.error(error);
    }
    console.log(post);
  });
});

client.login(process.env.BOT_TOKEN);
