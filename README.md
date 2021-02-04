# linky
Linky is a discord bot that runs on Heroku. It scrapes URL of attachments from Discord messages, and saves them to MongoDB. It uses`discord.js` and `mongoose` as dependencies.

## Setup

Two Heroku environment variables need to be configured before it can be deployed to Heroku. 

```
BOT_TOKEN = bot token from Discord developer portal
CON_STR = connection string derieved from MongoDB
```

## Message schema

Message schema contains two fields

```
const message = new Message({
  attachments: urlList,
  date: new Date(),
});
```

```
attachments: array of attachment urls retrieved
date: new date object
```
