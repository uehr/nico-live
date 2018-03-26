# nico-live
ニコニコ生放送のコメントを取得  
※全部屋のコメント取得は未対応

## simple demo
```JavaScript
const live = require("./nicoLive")
const cheerio = require("cheerio")

live.login("your mail", "your password").then(session => {
  live.get_provider(session, "lvxxxxxxxxx").then(provider => {
    return live.connect(session, provider)
  }).then(socket => {
    socket.on("data", data => {
      const comment = cheerio.load(data)("chat").text()
      console.log(comment)
    })
  })
})
```