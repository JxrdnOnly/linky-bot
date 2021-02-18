# linky
Linky is a discord bot that runs on NodeJS. It scrapes image urls from Discord messages, and saves them to MongoDB. It uses`discord.js` and `mongoose` as dependencies.

Currently supported formats for urls:

- Discord messages with native image attachments
- Twitter


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
attachments: array of attachment urls retrieved
date: new date object
urlType: 'discord' or 'twitter'
```
