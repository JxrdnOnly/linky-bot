# linky-bot
linky-bot is a discord bot that runs on NodeJS. It scrapes image Discord messages and saves them to MongoDB.

More specifically, linky-bot listens for discord messages that include twitter links, or discord image attachments, and saves them to persistent storage. linky-bot will also delete entries in persistent storage on message delete event triggered by a discord user within the channel.

Currently supported formats for urls:

- Discord messages with native image attachments
- Twitter (multiple twitter links can be regex matched within a single message, as long as they are seperated by a newline or a space)




## Setup

Environment variables need to be configured before it can be deployed to Heroku. 

```
BOT_TOKEN = bot token from Discord developer portal
CON_STR = connection string derieved from MongoDB
CHANNEL_LIST = string with channel ids seperated by a space (optional as default behavior is to save messages from all channels)
TOKEN_BEARER = token bearer string for twitter api
```

## Message schema

Message schema contains following fields

```
id: discord message id
attachments: array of attachment urls retrieved
date: new date object
urlType: 'discord' or 'twitter'
```
