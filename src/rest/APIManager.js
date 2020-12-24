const requester = require("./Request.js");
const Constants = require("../Constants.js");
module.exports = function(bot, web) {
  const request = new requester(bot);
  let route;
  const handler = {
    get(target, name) {
      if (typeof name !== "string")
        throw new Error(
          `Api's do not have type ${typeof name}. They must be a string.`
        );
      if (
        ["get", "post", "delete", "patch", "put"].includes(name.toLowerCase())
      ) {
        const pathTo = web ? Constants.WEB : Constants.APIS
        if (!Object.keys(pathTo).includes(route.toLowerCase()))
          throw new Error("API does not exist.");
        const path = pathTo[route.toLowerCase()];
        if (!path) throw new Error("API not implemented.");
        const method = name.toUpperCase();
        return options => request.make(path, method, options);
      }
      route = name;
      return new Proxy(() => {}, handler);
    }
  };
  return new Proxy(() => {}, handler);
};
