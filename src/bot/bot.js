const BaseBot = require("./baseBot.js");
module.exports = class Bot extends BaseBot {
  constructor() {
    super();
  }

  login(username, password) {
    return this.rest.api.login
      .post({
        body: {
          username,
          password
        }
      })
      .then(res => {
        this.cookie = this.getCookie(res);
        this.username = username;
        this.password = password;
        this.emit("debug", `Successfully logged in with user ${this.username}.`)
        this.emit("ready", this.cookie);
        this.emit("debug", "Starting heartbeat...")
        this.startHeartBeat();
        return res.content
     });
  }
  
  createThread(title, body, options) {
    this.rest.api.forum.post({
       body: {
         topic: options && options.topic ? options.topic : 1,
         title,
         body,
         draft: options && options.draft ? options.draft : 0,
         blurbID: options && options.blurbID ? options.blurbID : null,
         blurbType: options && options.blurbType ? options.blurbType : null
       }
      })
  }
};
