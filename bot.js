const Post = require("./models/post");
const Discord = require("discord.js");

const client = new Discord.Client();

twitterRegex = /https:\/\/twitter[^ \n]*/g;

const prepareUrlList = (discordMessage) => {
  let urlList = [];
  discordMessage.attachments.forEach((attachment) =>
    urlList.push(attachment.url)
  );
  return urlList;
};

const savePost = (urlList, urlType, id) => {
  const post = new Post({
    id,
    attachments: urlList,
    date: new Date(),
    urlType,
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

client.on("message", (discordMessage) => {
  if (discordMessage.attachments.size > 0) {
    if (process.env.CHANNEL_LIST) {
      channels = process.env.CHANNEL_LIST.split(" ");
      if (channels.includes(discordMessage.channel.id)) {
        savePost(prepareUrlList(discordMessage), "discord", discordMessage.id);
      }
    } else {
      savePost(prepareUrlList(discordMessage), "discord", discordMessage.id);
    }
  }

  if (discordMessage.content.match(twitterRegex)) {
    if (process.env.CHANNEL_LIST) {
      channels = process.env.CHANNEL_LIST.split(" ");
      if (channels.includes(discordMessage.channel.id)) {
        savePost(
          discordMessage.content.match(twitterRegex),
          "twitter",
          discordMessage.id
        );
      }
    } else {
      savePost(
        discordMessage.content.match(twitterRegex),
        "twitter",
        discordMessage.id
      );
    }
  }
});

client.on("messageDelete", function (message) {
  Post.deleteMany({ id: message.id }, (err) => {
    if (err) console.log(err);
    console.log("Successful deletion");
  });
});

//todo: delete mongodb entry when discord message is deleted

client.login(process.env.BOT_TOKEN);
