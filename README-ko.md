# nabang-bot

디스코드 봇

[English guide](./README.md)  
[봇 초대 링크](https://discord.com/api/oauth2/authorize?client_id=886101403603447868&permissions=0&scope=bot%20applications.commands)

이 봇은 데이터베이스를 가지고 있지 않아 재시작시 상태를 잃어버리지만 비용을 위해 의도된 것입니다.  
여러 편의기능이 추가될 수 있고 자유롭게 자신의 서버에 가져다 써도 괜찮지만 모든 것은 Nabi를 우선으로 합니다.

## /uwu

`/uwu` UwU  
`/uwu input:text` [lr]을 w로 바꿔줍니다.

## /tl relay

`/tl relay` nabinya 트위치 채널에서 영어 번역을 가져옵니다.  
`/tl relay target:channel` 다른 트위치 채널.  
`/tl relay target:stop`  

## /tl log

`/tl log start:messageId end:messageId`  
채팅 기록으로 txt파일을 생성합니다.  
메세지ID를 보려면 디스코드 개발자모드를 켜야 합니다.  
`/tl log padding:1`  
비디오 시작시간과 첫 채팅과의 차이(초)를 설정합니다.

## /clips

`/clips` Holodex에서 추가되는 Nabi의 클립들을 가져옵니다.  
`/relay switch:stop`

## /comment

`/comment` 현재 감시중인 서비스를 초기화합니다.  
`/comment url:youtubeUrl`  
유튜브 덧글 상태 감시를 시작합니다. 댓글 상태가 바뀌면 멘션이 옵니다.  
한 시간 동안 변동이 없으면 자동으로 종료됩니다.

## /reaction

`/reaction channel:channelId start:messageId end:messageId`  
채팅 기록으로 리액션이 많은 순서대로 정리합니다.  
`/reaction padding:1`  
비디오 시작시간과 첫 채팅과의 차이(초)를 설정합니다.  
`/reaction url:videoSrc`  
링크가 빠졌을 경우 타임스탬프 링크는 메세지로 이동합니다.

## /tag

`/tag channel:channelId start:messageId end:messageId`  
태그를 정리하여 출력합니다.  
`/tag padding:1`  
`/tag url:videoSrc`  
`/tag type:youtube`

### 명령어 예시

```py
/tag channel:831529891488727040 start:906876830106148904 end:906891833303506964 padding:144 url:https://youtu.be/VynRquiEWcw type:youtube
```

`channel` 번역이 릴레이되는 라이브 채팅 채널 ID  
`start` 첫번째 채팅 ID  
`end` 마지막 채팅 ID  
`padding` 영상에서 첫 번째 번역이 나온 시간(초)  
`url` 링크를 연결해 줄 유튜브 URL  
`type`youtube 유튜브 댓글형식으로 출력

### 태그 형식

1. ⭐ 리액션이 달려있는 번역
2. ⭐ 로 시작하는 채팅

### 태그 시간 수정

태그에 이모지를 추가합니다.

```
➖    (!adjust -5)
➖ 1️⃣ (!adjust -10)
➕ 3️⃣ (!adjust +30)
```
