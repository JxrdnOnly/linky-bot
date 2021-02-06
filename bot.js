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

client.on("message", (discordMessage) => {

  if (discordMessage.attachments == null) {
    if (process.env.CHANNEL_LIST) {
      channels = process.env.CHANNEL_LIST.split(" ");
      if (channels.includes(discordMessage.channel.id)) {
        savePost(discordMessage);
      }
    } else {
      savePost(discordMessage);
    }
  } 
});

client.on("messageUpdate", function(oldMessage, newMessage){
  console.log(`a message is updated`, newMessage);
});

//todo: delete mongodb entry when discord message is deleted

client.login(process.env.BOT_TOKEN);

