const Post = require("./models/post");
const Discord = require("discord.js");

const client = new Discord.Client();

const savePost = (discordMessage) => {
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
};

client.once("ready", () => {
  console.log("Started discord attachment scraper");
});

if (process.env.CHANNEL_LIST) {
  channels = process.env.CHANNEL_LIST.split(" ");

  client.on("message", (discordMessage) => {
    if (channels.includes(discordMessage.channel.id)) {
      savePost(discordMessage);
    }
  });
} else {
  client.on("message", (discordMessage) => savePost(discordMessage));
}

client.login(process.env.BOT_TOKEN);
