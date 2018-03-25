const request = require("request")
const net = require("net")
const cheerio = require("cheerio")

module.exports = {
  login: (mail, pw) => {
    return new Promise((resolve, reject) => {
      request.post({
        url: "https://secure.nicovideo.jp/secure/login",
        form: {
          mail_tel: mail,
          password: pw 
        }
      }, (err, res) => {
        if(err) reject(err)
        let cookies = res.headers["set-cookie"] || []
        cookies.forEach(cookie => {
          if(cookie.match(/^user_session=user_session/)){
            let session = cookie.slice(0, cookie.indexOf(";") + 1)
            resolve(session)
          }
        })
      })
    })
  },
  get_provider: (session, live_id) => {
    return new Promise((resolve, reject) => {
      request({
        url: `http://live.nicovideo.jp/api/getplayerstatus/${live_id}`,
        headers: {
          Cookie: session
        }
      }, (err, res) => {
        if(err) reject(err)
        const parsed = cheerio.load(res.body)
        const port = parsed("getplayerstatus ms port").text()
        const addr = parsed("getplayerstatus ms addr").text()
        const thread = parsed("getplayerstatus ms thread").text()
        resolve({port: parseInt(port), addr: addr, thread: thread})
      })
    })
  },
  connect: (session, provider) => {
    return new Promise((resolve, reject) => {
      let socket = net.connect(provider.port, provider.addr)
      socket.on("connect", () => {
        socket.setEncoding("utf-8")
        socket.write(`<thread thread='${provider.thread}' res_from="-5" version="20061206" />\0`)
        resolve(socket)
      })
    })
  }
}