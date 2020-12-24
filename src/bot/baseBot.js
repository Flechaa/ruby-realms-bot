const Constants = require("../Constants.js");
const EventEmitter = require("events");
module.exports = class BaseBot extends EventEmitter {
  constructor() {
    super();
    this.baseUrl = Constants.DOMAIN_URL;
  }

  get rest() {
    return {
      api: require("../rest/APIManager.js")(this),
      website: require("../rest/APIManager.js")(this, true)
    };
  }

  getCookie(result) {
    const raw = result.headers.raw()["set-cookie"];
    return raw.map(e => e.split(";")[0]).join(";");
  }
  
  sendHeartBeat() {
    this.rest.website.dashboard.get().then(async res => {
      if (res.redirected) return await this.login(this.username, this.password);
      this.emit("debug", `Sent hearbeat to the website with status ${res.status}.`);
    });
  }
  
  async startHeartBeat() {
    this.emit("debug", "Heartbeat successfully started, sending an initial heartbeat.")
    await this.sendHeartBeat();
    setInterval(async () => { 
      this.emit("debug", "Attempting to send heartbeat.");
      await this.sendHeartBeat()
    }, 240000);
  }
};
