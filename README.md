# nabang-bot
discord bot

[한국어 가이드](./README-ko.md)  
[Bot Invite Link](https://discord.com/api/oauth2/authorize?client_id=886101403603447868&permissions=0&scope=bot%20applications.commands)

## /uwu
`/uwu` UwU  
`/uwu input:text` [lr] to w

## /tl relay
`/tl relay` Brings out the translation of real-time chats from nabinya Twitch.  
`/tl relay switch:stop`

## /tl log
`/tl log start:messageId end:messageId`  
Generate a txt file from chat history.  
You must be enabled discord developer mode to see the id of the message.  
`/tl log padding:1`  
The difference seconds between the video start time and the first chat time.

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
