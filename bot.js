const Post = require("./models/post");
const Discord = require("discord.js");

const client = new Discord.Client();

twitterRegex = /https:\/\/twitter[^ \n]*/g;


const prepareUrlList = (discordMessage) => {
  let urlList = [];
  discordMessage.attachments.forEach((attachment) =>
    urlList.push(attachment.url)
  );
  return urlList
}

const savePost = (urlList, urlType) => {
  const post = new Post({
    attachments: urlList,
    date: new Date(),
    urlType
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
        savePost(prepareUrlList(discordMessage), "discord");
      }
    } else {
      savePost(prepareUrlList(discordMessage), "discord");
    }
  } 

  if (discordMessage.content.match(twitterRegex)) {
    let urlList = discordMessage.content.match(twitterRegex);
    savePost(urlList, "twitter")
  }
});

//todo: delete mongodb entry when discord message is deleted

client.login(process.env.BOT_TOKEN);

