const Post = require("./models/post");
const Discord = require("discord.js");

const client = new Discord.Client();
const axios = require("axios");

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

const saveTwitterPost = ({ id, attachments }) => {
  const post = new Post({
    id,
    attachments: attachments,
    date: new Date(),
    urlType: "twitter",
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

client.on("message", async (discordMessage) => {
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

  // For twitter links
  const tweetRegex = /https:\/\/twitter[^ \n]*/g;
  const tweetUrls = discordMessage.content.match(tweetRegex);

  if (tweetUrls) {
    let tweets = await Promise.all(
      tweetUrls.map(async (tweetUrl) => {
        const tweetIdRegex = /https:\/\/twitter\.com\/.*\/status\/(\d*)/;
        const tweetId = tweetUrl.match(tweetIdRegex)[1];
        let authStr = "Bearer ".concat(process.env.BEARER_TOKEN);
        return await axios.get(
          `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=entities&expansions=attachments.media_keys&media.fields=url`,
          { headers: { Authorization: authStr } }
        );
      })
    );

    tweets.map((tweet) => {
      if (process.env.CHANNEL_LIST) {
        channels = process.env.CHANNEL_LIST.split(" ");
        if (channels.includes(discordMessage.channel.id)) {
          let format = {
            id: discordMessage.id,
            attachments: tweet.data,
          };
  
          saveTwitterPost(format);
        }
      } else {
        let format = {
          id: discordMessage.id,
          attachments: tweet.data,
        };
  
        saveTwitterPost(format);
      }
    })
  }
});

client.on("messageDelete", function (message) {
  Post.deleteMany({ id: message.id }, (err) => {
    if (err) console.log(err);
    console.log("Successful deletion: ", message.id, message.content);
  });
});

client.login(process.env.BOT_TOKEN);
