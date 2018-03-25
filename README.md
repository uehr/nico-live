# nico-live
ニコニコ生放送のコメントを取得

## simple demo
```
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
  }).catch(error => {
    console.log(error)
  })
}).catch(error => {
  console.log(error)
})
```