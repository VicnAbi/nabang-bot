# nabang-bot

---
It is no longer managed. If you would like to relocate, please email abivicn@gmail.com.
---

discord bot

[한국어 가이드](./README-ko.md)  
[Bot Invite Link](https://discord.com/api/oauth2/authorize?client_id=886101403603447868&permissions=0&scope=bot%20applications.commands)

This bot does not have a database, so it loses its status on restart, but it is intended for cost.  
Multiple convenience features can be added and it's okay to bring it to your server freely, but Nabi is a priority for everything.

## /uwu

`/uwu` UwU  
`/uwu input:text` [lr] to w

## /tl relay

`/tl relay` Brings out the translation of real-time chats from nabinya Twitch.  
`/tl relay target:channel` Other Twitch channel.  
`/tl relay target:stop`  

## /tl log

`/tl log start:messageId end:messageId`  
Generate a txt file from chat history.  
You must be enabled discord developer mode to see the id of the message.  
`/tl log padding:1`  
The difference seconds between the video start time and the first chat time.

## /clips

`/clips` Brings out Nabi's clips that are added from Holodex.  
`/relay switch:stop`

## /comment

`/comment` Kill the observation service  
`/comment url:youtubeUrl`  
Start a observation service. If the comments are locked, a mention will come.  
If there is no change of condition for an hour, it will end automatically.

## /reaction

`/reaction channel:channelId start:messageId end:messageId`  
Organize it in the order of reactions.  
`/reaction padding:1`  
The difference seconds between the video start time and the first chat time.  
`/reaction url:videoSrc`  
If this parameter is missing, the timestamp link goes to the message.

## /tag

`/tag channel:channelId start:messageId end:messageId`  
Organize the tags.  
`/tag padding:1`  
`/tag url:videoSrc`  
`/tag type:youtube`

### Example command

```py
/tag channel:831529891488727040 start:906876830106148904 end:906891833303506964 padding:144 url:https://youtu.be/VynRquiEWcw type:youtube
```

`channel` Live chat channel ID where the translation is relayed.  
`start` The first chat ID  
`end` Last chat ID  
`padding` Time in seconds when the first translation came out in the video.  
`url` YouTube URL that will connect to the links.  
`type:youtube` Create a timestamp for YouTube comments.

### Tag format

1. Translations with reaction ⭐
2. Chats that start with ⭐

### Adjust tagged time

Add emojis to the tag.

```
➖    (!adjust -5)
➖ 1️⃣ (!adjust -10)
➕ 3️⃣ (!adjust +30)
```
