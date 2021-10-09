# nabang-bot
디스코드 봇

[봇 초대 링크](https://discord.com/api/oauth2/authorize?client_id=886101403603447868&permissions=0&scope=bot%20applications.commands)

## /uwu
`/uwu` UwU  
`/uwu input:text` [lr]을 w로 바꿔줍니다.

## /tl relay
`/tl relay` nabinya 트위치 채널에서 영어 번역을 가져옵니다.  
`/tl relay switch:stop`

## /tl log
`/tl log start:messageId end:messageId`  
채팅 기록으로 txt파일을 생성합니다.  
메세지ID를 보려면 디스코드 개발자모드를 켜야 합니다.  
`/tl log padding:1`  
비디오 시작시간과 첫 채팅과의 차이(초)를 설정합니다.

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
